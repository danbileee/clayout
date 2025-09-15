import { rem } from "@/utils/rem";
import type { CSSProperties } from "react";
import { styled, css } from "styled-components";

interface FlexProps {
  alignItems?: CSSProperties["alignItems"];
  justifyContent?: CSSProperties["justifyContent"];
  gap?: number;
}

interface FlexBoxProps extends FlexProps {
  isFluid?: boolean;
  width?: number | string;
  height?: number | string;
}

function shouldForwardProp(prop: string) {
  const nonForwardedProps = [
    "isFluid",
    "alignItems",
    "justifyContent",
    "gap",
    "width",
    "height",
  ];

  return !nonForwardedProps.includes(prop);
}

export const HFlexBox = styled.div.withConfig({
  shouldForwardProp,
})<FlexBoxProps>`
  display: flex;
  align-items: center;
  gap: ${({ gap = 0 }) => getSizeValue(gap)};
  width: ${({ width }) => (width ? getSizeValue(width) : "auto")};
  height: ${({ height }) => (height ? getSizeValue(height) : "auto")};
  ${({ isFluid }) =>
    isFluid &&
    css`
      width: 100%;
    `}
  ${({ justifyContent }) =>
    justifyContent &&
    css`
      justify-content: ${justifyContent};
    `}
`;

export const VFlexBox = styled.div.withConfig({
  shouldForwardProp,
})<FlexBoxProps>`
  display: flex;
  flex-direction: column;
  gap: ${({ gap = 0 }) => getSizeValue(gap)};
  width: ${({ width }) => (width ? getSizeValue(width) : "auto")};
  height: ${({ height }) => (height ? getSizeValue(height) : "auto")};
  ${({ isFluid }) =>
    isFluid &&
    css`
      width: 100%;
    `}
  ${({ alignItems }) =>
    alignItems &&
    css`
      align-items: ${alignItems};
    `}
`;

export const HInlineFlexBox = styled(HFlexBox).withConfig({
  shouldForwardProp,
})`
  display: inline-flex;
`;

function getSizeValue(value: number | string): string {
  return typeof value === "number" ? rem(value) : value;
}

interface GridProps {
  colums: number;
  gap?: number;
}

interface GridBoxProps extends GridProps {
  isFluid?: boolean;
  width?: number | string;
  height?: number | string;
}

export const GridBox = styled.div.withConfig({
  shouldForwardProp: (prop) => {
    const nonForwardedProps = ["isFluid", "columns", "gap", "width", "height"];

    return !nonForwardedProps.includes(prop);
  },
})<GridBoxProps>`
  display: grid;
  grid-template-columns: ${({ colums }) => `repeat(${colums}, 1fr)`};
  gap: ${({ gap = 0 }) => getSizeValue(gap)};
  width: ${({ width }) => (width ? getSizeValue(width) : "auto")};
  height: ${({ height }) => (height ? getSizeValue(height) : "auto")};
  ${({ isFluid }) =>
    isFluid &&
    css`
      width: 100%;
    `}
`;
