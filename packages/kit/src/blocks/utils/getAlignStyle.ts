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

export function getAlignStyle(
  containerStyle: BlockContainerStyle,
  inline?: boolean
): Pick<CSSProperties, "display" | "alignItems" | "justifyContent"> {
  const { align } = containerStyle ?? {};

  if (!align) return {};

  return {
    display: inline ? "inline-flex" : "flex",
    alignItems: "center",
    justifyContent: alignMap[align],
  };
}
