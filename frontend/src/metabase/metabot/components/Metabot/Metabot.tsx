import React, { useEffect, useState } from "react";
import { useAsyncFn } from "react-use";
import { t } from "ttag";
import { Dataset, MetabotFeedbackType, User } from "metabase-types/api";
import Question from "metabase-lib/Question";
import MetabotPrompt from "../MetabotPrompt";
import MetabotQueryBuilder from "../MetabotQueryBuilder";
import MetabotMessage from "../MetabotMessage";
import MetabotFeedback from "../MetabaseFeedback";
import { MetabotHeader, MetabotRoot } from "./Metabot.styled";

export interface QueryResults {
  prompt: string;
  question: Question;
  results: [Dataset];
}

export interface MetabotProps {
  user?: User;
  initialQuery?: string;
  placeholder: string;
  initialGreeting: React.ReactNode;
  onFetchResults: (query: string) => Promise<QueryResults>;
}

const Metabot = ({
  user,
  initialQuery,
  initialGreeting,
  placeholder,
  onFetchResults,
}: MetabotProps) => {
  const [{ loading, value, error }, handleRun] = useAsyncFn(onFetchResults);
  const [feedbackType, setFeedbackType] = useState<MetabotFeedbackType>();

  useEffect(() => {
    if (initialQuery) {
      handleRun(initialQuery);
    }
  }, [initialQuery, handleRun]);

  return (
    <MetabotRoot>
      <MetabotHeader>
        <MetabotMessage>
          {getMetabotGreeting(feedbackType) ?? initialGreeting}
        </MetabotMessage>
        <MetabotPrompt
          user={user}
          placeholder={placeholder}
          initialQuery={initialQuery}
          isRunning={loading}
          onRun={handleRun}
        />
      </MetabotHeader>

      {feedbackType !== "invalid-sql" && (
        <MetabotQueryBuilder
          question={value?.question}
          results={value?.results}
          loading={loading}
          error={error}
        />
      )}

      {value && !loading ? (
        <MetabotFeedback
          results={value}
          feedbackType={feedbackType}
          onChangeFeedbackType={setFeedbackType}
        />
      ) : null}
    </MetabotRoot>
  );
};

const getMetabotGreeting = (feedbackType?: MetabotFeedbackType) => {
  if (feedbackType === "invalid-sql") {
    return t`Sorry about that. Let me know what the SQL should've been.`;
  }
  return null;
};

export default Metabot;
