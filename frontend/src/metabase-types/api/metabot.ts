export type MetabotFeedbackType =
  | "great"
  | "wrong-data"
  | "incorrect-result"
  | "invalid-sql";

export interface MetabotFeedbackPayload {
  feedback: MetabotFeedbackType;
  prompt: string;
  sql: string;
  correct_sql?: string;
  message?: string;
}
