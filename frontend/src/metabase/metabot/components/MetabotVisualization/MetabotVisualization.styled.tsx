import styled from "@emotion/styled";
import { color } from "metabase/lib/colors";
import Visualization from "metabase/visualizations/components/Visualization";

export const FullVisualization = styled(Visualization)`
  display: flex;
  flex: 1 0 auto;
  background-color: ${color("bg-white")};
`;
