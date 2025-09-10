import type { SiteBlockSchema } from "@clayout/interface";
import type { CSSProperties } from "react";
import type { z } from "zod";

const alignMap: Record<
  "left" | "right" | "center" | "justify",
  CSSProperties["justifyContent"]
> = {
  left: "flex-start",
  right: "flex-end",
  center: "center",
  justify: "stretch",
};

type Params = z.infer<typeof SiteBlockSchema>["containerStyle"];

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
