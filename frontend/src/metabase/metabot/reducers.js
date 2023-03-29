import { handleActions } from "redux-actions";
import {
  FETCH_QUERY_RESULTS,
  FETCH_QUESTION,
  INIT,
  RESET,
  RUN_PROMPT_QUERY,
  RUN_PROMPT_QUERY_FULFILLED,
  RUN_PROMPT_QUERY_REJECTED,
  RUN_QUESTION_QUERY,
  RUN_QUESTION_QUERY_FULFILLED,
  RUN_QUESTION_QUERY_REJECTED,
  SUBMIT_FEEDBACK,
  UPDATE_FEEDBACK_TYPE,
  UPDATE_PROMPT,
  UPDATE_QUESTION,
} from "./actions";

export const entityId = handleActions(
  {
    [INIT]: { next: (state, { payload }) => payload.entityId },
    [RESET]: { next: () => null },
  },
  null,
);

export const entityType = handleActions(
  {
    [INIT]: { next: (state, { payload }) => payload.entityType },
    [RESET]: { next: () => null },
  },
  null,
);

export const card = handleActions(
  {
    [FETCH_QUESTION]: { next: (state, { payload }) => payload },
    [UPDATE_QUESTION]: { next: (state, { payload }) => payload },
    [RUN_PROMPT_QUERY]: { next: () => null },
    [RESET]: { next: () => null },
  },
  null,
);

export const originalCard = handleActions(
  {
    [FETCH_QUESTION]: { next: (state, { payload }) => payload },
    [RESET]: { next: () => null },
  },
  null,
);

export const prompt = handleActions(
  {
    [INIT]: { next: (state, { payload }) => payload.initialPrompt ?? "" },
    [UPDATE_PROMPT]: { next: (state, { payload }) => payload },
    [RESET]: { next: () => "" },
  },
  "",
);

export const queryStatus = handleActions(
  {
    [RUN_PROMPT_QUERY]: { next: () => "running" },
    [RUN_PROMPT_QUERY_FULFILLED]: { next: () => "complete" },
    [RUN_PROMPT_QUERY_REJECTED]: { next: () => "complete" },
    [RUN_QUESTION_QUERY]: { next: () => "running" },
    [RUN_QUESTION_QUERY_FULFILLED]: { next: () => "complete" },
    [RUN_QUESTION_QUERY_REJECTED]: { next: () => "complete" },
    [RESET]: { next: () => "idle" },
  },
  "idle",
);

export const queryResults = handleActions(
  {
    [RUN_PROMPT_QUERY]: { next: () => null },
    [FETCH_QUERY_RESULTS]: { next: (state, { payload }) => payload },
    [RESET]: { next: () => null },
  },
  null,
);

export const queryError = handleActions(
  {
    [RUN_PROMPT_QUERY_REJECTED]: { next: (state, { payload }) => payload },
    [RUN_QUESTION_QUERY_REJECTED]: { next: (state, { payload }) => payload },
    [RESET]: { next: () => null },
  },
  null,
);

export const feedbackType = handleActions(
  {
    [RUN_PROMPT_QUERY]: { next: () => null },
    [UPDATE_FEEDBACK_TYPE]: { next: (state, { payload }) => payload },
    [RESET]: { next: () => null },
  },
  null,
);

export const feedbackStatus = handleActions(
  {
    [RUN_PROMPT_QUERY]: { next: () => "idle" },
    [SUBMIT_FEEDBACK]: { next: () => "complete" },
    [RESET]: { next: () => "idle" },
  },
  "idle",
);