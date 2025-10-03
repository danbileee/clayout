import { SiteContentFitWidth, SitePageSchema } from "@clayout/interface";
import type { ReactNode } from "react";
import type { z } from "zod";
import { getAlignStyle } from "../utils/getAlignStyle";
import { getMaxWidth } from "../utils/getMaxWidth";
import { getComposedStyleObject } from "../utils/getComposedStyleObject";
import { getComposedStyleString } from "../utils/getComposedStyleString";

export function renderToJsx(page: z.infer<typeof SitePageSchema>) {
  const { containerStyle } = page;
  const {
    contentFit = "sm",
    padding,
    margin = "0px 0px 0px 0px",
    align = "center",
    ...restContainerStyle
  } = containerStyle ?? {};
  const containerWidth = getMaxWidth("100%", margin);
  const alignStyle = getAlignStyle({ align });

  return function Component({ children }: { children: ReactNode }) {
    return (
      <main
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          ...alignStyle,
          alignItems: "flex-start",
          ...getComposedStyleObject(restContainerStyle),
        }}
      >
        <div
          style={{
            position: "relative",
            padding,
            margin,
            width: containerWidth,
            maxWidth: SiteContentFitWidth[contentFit],
            minHeight: "100%",
          }}
        >
          {children}
        </div>
      </main>
    );
  };
}

export function renderToString(page: z.infer<typeof SitePageSchema>) {
  const { containerStyle } = page;
  const {
    contentFit = "sm",
    padding,
    margin = "0px 0px 0px 0px",
    align = "center",
    ...restContainerStyle
  } = containerStyle ?? {};
  const pageWidth = getMaxWidth("100%", margin);
  const mainStyle = getComposedStyleString({
    position: "relative",
    width: "100%",
    minHeight: "100svh",
    height: "100%",
    ...getAlignStyle({ align }),
    alignItems: "flex-start",
    ...restContainerStyle,
  });
  const pageStyle = getComposedStyleString({
    position: "relative",
    padding,
    margin,
    width: pageWidth,
    maxWidth: SiteContentFitWidth[contentFit],
    minHeight: "inherit",
  });

  return function renderer(innerContent: string) {
    return `<main style="${mainStyle}">
  <div class="page" style="${pageStyle}">
    ${innerContent}
  </div>
</main>`;
  };
}

export function renderToTable() {}
