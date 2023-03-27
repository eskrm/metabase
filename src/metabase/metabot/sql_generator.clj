(ns metabase.metabot.sql-generator
  (:require
   [clojure.string :as str]
   [honey.sql :as hsql]
   [metabase.db.query :as mdb.query]
   [metabase.metabot.util :as metabot-util]
   [metabase.metabot.invoker :as mbi]
   [metabase.util :as u]))

;;;;;;;;;;;;;;;;;;;;;;;;;;; Baseline approach: Feed in the create table DDL as training data ;;;;;;;;;;;;;;;;;;;;;;;;;;;

(defn- create-enum-ddl
  "Create the postgres enum for any item in result_metadata that has enumerated/low cardinality values."
  [{:keys [result_metadata]}]
  (into {}
        (for [{:keys [sql_name possible_values]} result_metadata :when (seq possible_values)]
          [sql_name
           (format "create type %s_t as enum %s;"
                   sql_name
                   (str/join ", " (map (partial format "'%s'") possible_values)))])))

(defn- create-table-ddl
  "Create an equivalent DDL for this model"
  [{:keys [sql_name result_metadata] :as model}]
  (let [enums (create-enum-ddl model)
        [ddl] (hsql/format
               {:create-table sql_name
                :with-columns (for [{:keys [display_name base_type]} result_metadata
                                    :let [k (metabot-util/normalize-name display_name)]]
                                [k (if (enums k)
                                     (format "%s_t" k)
                                     base_type)])}
               {:dialect :ansi})]
    (str/join "\n\n"
              (conj (vec (vals enums)) (mdb.query/format-sql ddl)))))

(defn- prepare-ddl-based-sql-generator-input
  "Given a model, prepare a set of statements to prompt the bot for the SQL response."
  [{:keys [sql_name] :as model} prompt]
  (let [table-name    sql_name
        system-prompt (format
                       "You are a helpful assistant that writes SQL to query the table '%s' using SELECT statements based on user input."
                       table-name)
        ddl           (create-table-ddl model)]
    [{:role "system" :content system-prompt}
     {:role "assistant" :content (format "This is the SQL used to create the table '%s'" table-name)}
     {:role "assistant" :content ddl}
     {:role "assistant" :content (format "The table '%s' has data in it." table-name)}
     {:role "assistant" :content (format "Use this DDL to write a SELECT statement about the table '%s'" table-name)}
     {:role "assistant" :content "Do not explain the SQL statement, just give me the raw SELECT statement."}
     {:role "user" :content prompt}]))
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(defn extract-sql
  "Search a provided string for a SQL block"
  [s]
  (if (str/starts-with? (u/upper-case-en (str/trim s)) "SELECT")
    ;; This is just a raw SQL statement
    s
    ;; It looks like markdown
    (let [[_pre sql _post] (str/split s #"```(sql|SQL)?")]
      (mdb.query/format-sql sql))))

(defn- denormalized-model->sql
  "Given a denormalized model (all data) and a question, call the bot
  (if the fake key isn't true and the env is configured correctly)
  and return the parsed SQL."
  [denormalized-model {:keys [question fake]}]
  (cond
    fake "SELECT * FROM ORDERS; -- THIS IS FAKE"
    (and
     (mbi/openai-api-key)
     (mbi/openai-organization)) (mbi/invoke-metabot
                                 (prepare-ddl-based-sql-generator-input denormalized-model question)
                                 extract-sql)
    :else "Set MB_OPENAI_API_KEY and MB_OPENAI_ORGANIZATION env vars and relaunch!"))

(defn generate-dataset-from-prompt
  "Given a model and prompt, attempt to generate a native dataset."
  ([{:keys [database_id] :as denormalized-model} prompt fake]
   (when-some [bot-sql (denormalized-model->sql denormalized-model {:question prompt :fake fake})]
     (let [final-sql (metabot-util/bot-sql->final-sql denormalized-model bot-sql)
           response  {:dataset_query          {:database database_id
                                               :type     "native"
                                               :native   {:query final-sql}}
                      :display                :table
                      :visualization_settings {}}]
       (tap> {:bot-sql   bot-sql
              :final-sql final-sql
              :response  response})
       response)))
  ([denormalized-model prompt]
   (generate-dataset-from-prompt denormalized-model prompt false)))
