import type { BlockContainerStyle } from "@clayout/interface";
import type { CSSProperties } from "react";

const alignMap: Record<
  NonNullable<BlockContainerStyle["align"]>,
  CSSProperties["justifyContent"]
> = {
  left: "flex-start",
  right: "flex-end",
  center: "center",
  justify: "stretch",
};

type Params = BlockContainerStyle;

type Returns = Pick<CSSProperties, "display" | "alignItems" | "justifyContent">;

export function getAlignStyle(containerStyle: Params): Returns {
  const { align } = containerStyle ?? {};

  if (!align) return {};

  return {
    display: "flex",
    alignItems: "center",
    justifyContent: alignMap[align],
  };
}
