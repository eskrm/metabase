(ns ^:mb/once metabase.models.dashboard-tab-test
  (:require
   [clojure.test :refer :all]
   [metabase.api.common :as api]
   [metabase.models :refer [Card Collection Dashboard DashboardCard]]
   [metabase.models.interface :as mi]
   [metabase.models.permissions :as perms]
   [metabase.test :as mt]
   [metabase.test.fixtures :as fixtures]
   [toucan2.core :as t2]
   [toucan2.tools.with-temp :as t2.with-temp]))

(use-fixtures
  :once
  (fixtures/initialize :test-users-personal-collections))

(defn do-with-dashtab-in-personal-collection [f]
    (let [owner-id (mt/user->id :rasta)
          coll     (t2/select-one Collection :personal_owner_id owner-id)]
      (t2.with-temp/with-temp
        [Card            card     {}
         Dashboard       dash     {:collection_id (:id coll)}
         :m/DashboardTab dashtab  {:dashboard_id (:id dash)}
         DashboardCard   dashcard {:dashboard_id (:id dash) :card_id (:id card) :dashboardtab_id (:id dashtab)}]
        (f {:owner-id   owner-id
            :collection coll
            :card       card
            :dashboard  dash
            :dashcard   dashcard
            :dashtab    dashtab}))))

(defmacro with-dashtab-in-personal-collection
  [binding & body]
  `(do-with-dashtab-in-collection (fn [~binding] ~@body)))

(deftest perms-test
  (with-dashtab-in-collection {:keys [collection dashboard dashtab] :as _dashtab}
    (testing (str "Check that if a Dashtab of a Dashboard is in a Collection, someone who would not be able to see it under the old "
                  "artifact-permissions regime will be able to see it if they have permissions for that Collection")
      (binding [api/*current-user-permissions-set* (delay #{(perms/collection-read-path collection)})]
        (is (= true
               (mi/can-read? dashtab)))
        (is (= false
               (mi/can-write? dashtab)))))

    (testing "Do we have *write* Permissions for a dashtab if we have *write* Permissions for the Collection its in?"
      (binding [api/*current-user-permissions-set* (delay #{(perms/collection-readwrite-path collection)})]
        (is (= true (mi/can-read? dashtab)))
        (is (= true (mi/can-write? dashtab)))))

    (testing "An user that can't see the Collection a Dashboard is in can't see the dashtab"
      (mt/with-current-user (mt/user->id :lucky)
        (is (= false (mi/can-read? dashboard)))
        (is (= false (mi/can-write? dashboard)))))

    (testing "An user that can see the Collection a Dashboard is in can see and write the dashtab"
      (mt/with-current-user (mt/user->id :rasta)
        (is (= true (mi/can-read? dashboard)))
        (is (= true (mi/can-write? dashboard)))))))

(deftest dependency-tests
  (testing "Deleting a dashtab should delete the associated dashboardcards"
    (with-dashtab-in-personal-collection {:keys [dashtab dashcard]}
      (t2/delete! dashtab)
      (is (= nil (t2/select-one DashboardCard :id (:id dashcard)))))))
