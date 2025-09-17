import { rem } from "@/utils/rem";
import {
  useMemo,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { ReactElement } from "react";
import useMeasure from "react-use-measure";
import { styled, css } from "styled-components";

export interface FlexProps {
  alignItems?: CSSProperties["alignItems"];
  justifyContent?: CSSProperties["justifyContent"];
  gap?: number;
}

export interface FlexBoxProps extends FlexProps {
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

interface ScrollBoxProps {
  padding?: number;
}

export const ScrollBox = styled.div.withConfig({
  shouldForwardProp: (prop) => {
    const nonForwardedProps = ["padding"];

    return !nonForwardedProps.includes(prop);
  },
})<ScrollBoxProps>`
  position: relative;
  ${({ padding }) =>
    padding
      ? css`
          width: calc(100% + ${rem(padding)});
          padding-right: ${rem(padding)};
          margin-right: ${rem(-padding)};
          overflow-y: auto;
        `
      : css`
          width: 100%;
          overflow-y: auto;
        `}
`;

const CARD_MIN_WIDTH = 288;
const CARD_MAX_WIDTH = 365;
const CARD_GAP = 16;

const Variants = {
  Static: "static",
  Filled: "filled",
  SingleLine: "single-line",
} as const;

type ChildProps = {
  maxCards: number;
};

type DynamicGridBoxCommonProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  cardWidth?: {
    min?: number;
    max?: number;
  };
  gap?: number;
};

type DynamicGridBoxPropsSingleLine = DynamicGridBoxCommonProps & {
  variant: typeof Variants.SingleLine;
  children: (childProps: ChildProps) => ReactNode;
};

type DynamicGridBoxPropsFilled = DynamicGridBoxCommonProps & {
  variant?: typeof Variants.Filled;
  children: ReactNode;
};

type DynamicGridBoxPropsStatic = DynamicGridBoxCommonProps & {
  variant: typeof Variants.Static;
  children: ReactNode;
};

type DynamicGridBoxProps =
  | DynamicGridBoxPropsSingleLine
  | DynamicGridBoxPropsFilled
  | DynamicGridBoxPropsStatic;

/**
 * A responsive grid box that lays out multiple child items based on available width.
 * @param cardWidth The min/max width of each child item
 * @param gap The gap between child items
 * @param variant How children are sized within the grid (static: fixed width, filled: 1fr columns, single-line: show a single row only)
 * @returns maxCards A child prop for single-line variant indicating max cards per row based on width
 */
export function DynamicGridBox(
  props: DynamicGridBoxPropsSingleLine
): ReactElement;
export function DynamicGridBox(props: DynamicGridBoxPropsFilled): ReactElement;
export function DynamicGridBox(props: DynamicGridBoxPropsStatic): ReactElement;
export function DynamicGridBox({
  cardWidth,
  gap = CARD_GAP,
  variant = Variants.Filled,
  children,
  ...props
}: DynamicGridBoxProps) {
  const [wrapperRef, { width: wrapperWidth }] = useMeasure();
  const maxCards = useMemo(() => {
    const maxWidth = cardWidth?.max ?? CARD_MAX_WIDTH;
    const minWidth = cardWidth?.min ?? CARD_MIN_WIDTH;
    const avgWidth = Math.ceil((minWidth + maxWidth) / 2);
    const tempCounts = Math.ceil(wrapperWidth / avgWidth);
    const totalGap = Math.ceil(gap * (tempCounts - 1));
    const nomalizedWrapperWidth = wrapperWidth - totalGap;

    return Math.ceil(nomalizedWrapperWidth / avgWidth);
  }, [cardWidth?.max, cardWidth?.min, gap, wrapperWidth]);

  let content: ReactNode;
  switch (variant) {
    case Variants.SingleLine:
      content = (children as (p: ChildProps) => ReactNode)({ maxCards });
      break;
    case Variants.Static:
    case Variants.Filled:
    default:
      content = children as ReactNode;
  }

  return (
    <DynamicGridBoxBase
      ref={wrapperRef}
      cardWidth={cardWidth}
      variant={variant}
      gap={gap}
      {...props}
    >
      {content}
    </DynamicGridBoxBase>
  );
}

type DynamicGridBoxBaseProps = {
  cardWidth?: {
    min?: number;
    max?: number;
  };
  variant?: (typeof Variants)[keyof typeof Variants];
  gap?: number;
};

const DynamicGridBoxBase = styled.div.withConfig({
  shouldForwardProp: (prop) => {
    const nonForwardedProps = ["cardWidth", "variant", "gap"];

    return !nonForwardedProps.includes(prop);
  },
})<DynamicGridBoxBaseProps>`
  width: 100%;
  display: grid;
  gap: ${({ gap = 0 }) => rem(gap)};
  ${({ cardWidth, variant }) => css`
    grid-template-columns: repeat(
      auto-fill,
      minmax(
        ${rem(cardWidth?.min ?? CARD_MIN_WIDTH)},
        ${variant === "static"
          ? `${rem(cardWidth?.max ?? CARD_MAX_WIDTH)}`
          : "1fr"}
      )
    );
  `}
  ${({ variant }) =>
    variant === "single-line" &&
    css`
      grid-template-rows: auto 0;
      overflow: hidden;
    `}
`;
