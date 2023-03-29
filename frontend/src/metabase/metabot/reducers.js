import { handleActions } from "redux-actions";
import {
  FETCH_CARD,
  FETCH_QUERY_RESULTS,
  INIT,
  QUERY_COMPLETED,
  RESET,
  RUN_QUERY,
  SET_CARD,
  SET_FEEDBACK_TYPE,
  SET_PROMPT_TEXT,
  SUBMIT_FEEDBACK,
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
    [SET_CARD]: { next: (state, { payload }) => payload },
    [FETCH_CARD]: { next: (state, { payload }) => payload },
    [RESET]: { next: () => null },
  },
  null,
);

export const originalCard = handleActions(
  {
    [FETCH_CARD]: { next: (state, { payload }) => payload },
    [RESET]: { next: () => null },
  },
  null,
);

export const prompt = handleActions(
  {
    [INIT]: { next: (state, { payload }) => payload.initialPrompt },
    [SET_PROMPT_TEXT]: { next: (state, { payload }) => payload },
    [RESET]: { next: () => "" },
  },
  "",
);

export const queryStatus = handleActions(
  {
    [RUN_QUERY]: { next: () => "running" },
    [QUERY_COMPLETED]: { next: () => "complete" },
    [RESET]: { next: () => "idle" },
  },
  "idle",
);

export const queryResults = handleActions(
  {
    [FETCH_QUERY_RESULTS]: { next: (state, { payload }) => payload },
    [RESET]: { next: () => null },
  },
  null,
);

export const queryError = handleActions(
  {
    [RESET]: { next: () => null },
  },
  null,
);

export const feedbackType = handleActions(
  {
    [FETCH_CARD]: { next: () => null },
    [SET_FEEDBACK_TYPE]: { next: (state, { payload }) => payload },
    [RESET]: { next: () => null },
  },
  null,
);

export const feedbackStatus = handleActions(
  {
    [FETCH_CARD]: { next: () => "idle" },
    [SUBMIT_FEEDBACK]: { next: () => "complete" },
    [RESET]: { next: () => "idle" },
  },
  "idle",
);
