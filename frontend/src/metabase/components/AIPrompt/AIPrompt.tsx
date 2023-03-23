import React from "react";
import { t } from "ttag";
import { color } from "metabase/lib/colors";
import Input from "metabase/core/components/Input";
import RunButton from "metabase/query_builder/components/RunButton";
import { User } from "metabase-types/api";
import UserAvatar from "../UserAvatar";
import {
  AIPromptActions,
  AIPromptInput,
  AIPromptInputContainer,
  AIPromptRoot,
  AIPromptUserAvatar,
} from "./AIPrompt.styled";

type Props = {
  isRunning: boolean;
  isDirty: boolean;
  circular: boolean;
  onRun: (prompt: string) => void;
  onCancel: () => void;
  user: User;
};

const AIPrompt = ({
  isRunning,
  isDirty = true,
  circular,
  onRun,
  onCancel,
  user,
}: Props) => {
  return (
    <AIPromptRoot>
      <AIPromptUserAvatar>
        <UserAvatar bg={color("accent2")} user={user} />
      </AIPromptUserAvatar>
      <AIPromptInputContainer>
        <AIPromptInput
          fullWidth
          placeholder={t`Ask something like, how many subscriptions have we had over time?`}
        />
      </AIPromptInputContainer>
      <AIPromptActions>
        <RunButton
          compact
          isRunning={isRunning}
          isDirty={isDirty}
          circular={circular}
          onRun={onRun}
          onCancel={onCancel}
        />
      </AIPromptActions>
    </AIPromptRoot>
  );
};

export default AIPrompt;
