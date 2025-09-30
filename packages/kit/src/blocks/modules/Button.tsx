import type { z } from "zod";
import { Block } from "../block";
import { SiteBlockTypes, ButtonBlockSchema } from "@clayout/interface";
import { getMaxWidth } from "../utils/getMaxWidth";
import { getComposedStyleString } from "../utils/getComposedStyleString";
import { getAlignStyle } from "../utils/getAlignStyle";
import { getComposedStyleObject } from "../utils/getComposedStyleObject";
import { basicFontFamily } from "../constants";

export class ButtonBlock extends Block<z.infer<typeof ButtonBlockSchema>> {
  static readonly type = SiteBlockTypes.Button;

  renderToJsx() {
    const {
      width: cWidth,
      margin = "0px 0px 0px 0px",
      padding = "0px 0px 0px 0px",
      align,
      ...containerStyle
    } = this.block.containerStyle ?? {};
    const { width, textAlign, ...style } = this.block.style ?? {};
    const { link, text } = this.block.data ?? {};
    const containerWidth = cWidth ?? getMaxWidth("100%", margin);
    const alignStyle = getAlignStyle({ align });
    const buttonAlignStyle = getAlignStyle({ align: textAlign }, true);

    return (
      <div
        style={{
          width: containerWidth,
          margin,
        }}
      >
        <div
          style={{
            width: "100%",
            padding,
            ...getComposedStyleObject(containerStyle),
            ...alignStyle,
          }}
        >
          <a
            style={{
              ...style,
              ...buttonAlignStyle,
              width,
            }}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {text}
          </a>
        </div>
      </div>
    );
  }

  renderToString(): string {
    const {
      width: cWidth,
      margin = "0px 0px 0px 0px",
      padding = "0px 0px 0px 0px",
      align,
      ...containerStyle
    } = this.block.containerStyle ?? {};
    const { width, textAlign, ...style } = this.block.style ?? {};
    const { link, text } = this.block.data ?? {};
    const containerWidth = cWidth ?? getMaxWidth("100%", margin);
    const alignStyle = getAlignStyle({ align });
    const buttonAlignStyle = getAlignStyle({ align: textAlign }, true);

    const outerContainerStyle = getComposedStyleString({
      width: containerWidth,
      margin,
    });
    const innerContainerStyle = getComposedStyleString({
      ...containerStyle,
      ...alignStyle,
      width: "100%",
      padding,
    });
    const buttonStyle = getComposedStyleString({
      ...style,
      ...buttonAlignStyle,
      width,
    });

    return `<div style="${outerContainerStyle}">
  <div style="${innerContainerStyle}">
    <a
      style="${buttonStyle}"
      href="${link}"
      target="_blank"
      rel="noopener noreferrer"
    >
      ${text}
    </a>
  </div>
</div>`;
  }

  renderToTable(): string {
    const {
      width: cWidth,
      margin = "0px 0px 0px 0px",
      align,
      ...restContainerStyles
    } = this.block.containerStyle ?? {};
    const { width, ...restStyles } = this.block.style ?? {};
    const { link, text } = this.block.data ?? {};
    const containerWidth = cWidth ?? getMaxWidth("100%", margin);
    const containerStyle = getComposedStyleString(restContainerStyles);
    const style = getComposedStyleString({
      ...restStyles,
      display: "inline-block",
      width,
    });

    return `<tr>
  <td align="center" valign="top" style="width: 100%;">
    <table border="0" cellpadding="0" cellspacing="0" style="width: ${containerWidth}; margin: ${margin};">
      <tbody>
        <tr>
          <td align="${align}" valign="top" style="${containerStyle}" class="button">
            <a
              href="${link}"
              style="${style}"
              target="_blank"
              rel="noopener noreferrer"
            >${text}</a>
          </td>
        </tr>
      </tbody>
    </table>
  </td>
</tr>`;
  }
}

export const ButtonBlockData: z.infer<typeof ButtonBlockSchema> = {
  type: SiteBlockTypes.Button,
  name: "Sample Button Block",
  slug: "sample-button",
  data: {
    link: "https://clayout.app",
    text: "Submit",
  },
  style: {
    width: "auto",
    backgroundColor: "#2563eb",
    padding: "8px 16px 8px 16px",
    color: "#ffffff",
    fontFamily: basicFontFamily,
    fontSize: "16px",
    fontWeight: "medium",
    borderWidth: "0px",
    borderStyle: "solid",
    borderColor: "transparent",
    borderRadius: "6px",
    textDecoration: "none",
    textAlign: "center",
  },
  containerStyle: {
    padding: "16px 16px 16px 16px",
    backgroundColor: "transparent",
    align: "center",
  },
};
