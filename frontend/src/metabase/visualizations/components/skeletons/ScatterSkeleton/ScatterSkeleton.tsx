import React from "react";
import { SharedChartSkeletonProps } from "../ChartSkeleton/types";
import SkeletonCaption from "../SkeletonCaption";
import { SkeletonRoot, SkeletonImage } from "./ScatterSkeleton.styled";

const ScatterSkeleton = ({
  name,
  description,
  isStatic,
  ...props
}: SharedChartSkeletonProps): JSX.Element => {
  return (
    <SkeletonRoot {...props}>
      <SkeletonCaption name={name} description={description} />
      <SkeletonImage
        isStatic={isStatic}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 340 119"
        preserveAspectRatio="xMidYMid"
      >
        <circle cx="11" cy="58" r="11" fill="currentColor" />
        <circle cx="88" cy="58" r="26" fill="currentColor" />
        <circle cx="208" cy="29" r="21" fill="currentColor" />
        <circle cx="301.5" cy="80.5" r="38.5" fill="currentColor" />
        <circle cx="11" cy="20" r="6" fill="currentColor" />
        <circle cx="82" cy="4" r="4" fill="currentColor" />
        <circle cx="298" cy="4" r="4" fill="currentColor" />
        <circle cx="141" cy="15" r="11" fill="currentColor" />
        <circle cx="141" cy="87" r="16" fill="currentColor" />
      </SkeletonImage>
    </SkeletonRoot>
  );
};

export default ScatterSkeleton;
