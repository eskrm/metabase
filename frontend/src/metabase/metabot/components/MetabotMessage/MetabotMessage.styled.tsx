import styled from "@emotion/styled";
import { color } from "metabase/lib/colors";
import MetabotLogo from "metabase/core/components/MetabotLogo";

export const MetabotMessageRoot = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const MetabotIcon = styled(MetabotLogo)`
  height: 2.5rem;
`;

export const MetabotText = styled.div`
  display: inline-block;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background-color: ${color("bg-light")};
  color: ${color("text-medium")};
  font-weight: bold;
`;

export const MetabotFeedbackContainer = styled.footer`
  padding: 1rem;
  background-color: ${color("white")};
`;
