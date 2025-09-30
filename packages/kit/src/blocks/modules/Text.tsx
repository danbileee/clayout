import type { z } from "zod";
import { Block } from "../block";
import { SiteBlockTypes, TextBlockSchema } from "@clayout/interface";
import { getMaxWidth } from "../utils/getMaxWidth";
import { getComposedStyleString } from "../utils/getComposedStyleString";
import { getComposedStyleObject } from "../utils/getComposedStyleObject";
import { getAlignStyle } from "../utils/getAlignStyle";
import { basicFontFamily } from "../constants";

export class TextBlock extends Block<z.infer<typeof TextBlockSchema>> {
  static readonly type = SiteBlockTypes.Text;

  renderToJsx() {
    const {
      width: cWidth,
      align,
      margin = "0px 0px 0px 0px",
      ...containerStyle
    } = this.block.containerStyle ?? {};
    const containerWidth = cWidth ?? getMaxWidth("100%", margin);
    const alignStyle = getAlignStyle({ align });

    return (
      <div
        style={{
          width: containerWidth,
          margin,
        }}
      >
        <div
          style={{
            ...getComposedStyleObject(containerStyle),
            ...alignStyle,
            width: "100%",
          }}
        >
          <p style={{ wordBreak: "break-word", ...this.block.style }}>
            {this.block.data?.value}
          </p>
        </div>
      </div>
    );
  }

  renderToString(): string {
    const {
      width: cWidth,
      align,
      margin = "0px 0px 0px 0px",
      ...restContainerStyle
    } = this.block.containerStyle ?? {};
    const alignStyle = getAlignStyle({ align });
    const containerStyle = getComposedStyleString({
      ...restContainerStyle,
      ...alignStyle,
      width: "100%",
    });
    const textStyle = getComposedStyleString({
      ...this.block.style,
    });
    const containerWidth = cWidth ?? getMaxWidth("100%", margin);

    return `<div style="width: ${containerWidth}; margin: ${margin}; ">
  <div style="${containerStyle}">
    <p style="word-break: break-word; ${textStyle}">${this.block.data?.value}</p>
  </div>    
</div>`;
  }

  renderToTable(): string {
    const {
      width: cWidth,
      align,
      margin = "0px 0px 0px 0px",
      ...restContainerStyle
    } = this.block.containerStyle ?? {};
    const containerWidth = cWidth ?? getMaxWidth("100%", margin);

    const containerStyle = getComposedStyleString({
      width: containerWidth,
      margin,
    });
    const textStyle = getComposedStyleString({
      ...restContainerStyle,
      ...this.block.style,
    });

    return `<tr>
  <td align="center" valign="top" style="width: 100%;">
    <table border="0" cellpadding="0" cellspacing="0" style="${containerStyle}">
      <tbody>
        <tr>
          <td align="${align}" valign="top" style="${textStyle}" class="text">
            <p>
              ${this.block.data?.value}
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </td>
</tr>`;
  }
}

export const TextBlockData: z.infer<typeof TextBlockSchema> = {
  type: SiteBlockTypes.Text,
  name: "Sample Text Block",
  slug: "sample-text",
  data: {
    value:
      "Clayout is clarity in structure, simplicity in touch. Where ideas take shape — instantly, intuitively. Build without code. Share without effort. Design it. Shape it. Send it.",
  },
  style: {
    width: "auto",
    color: "#1C2024",
    fontFamily: basicFontFamily,
    fontSize: "16px",
    lineHeight: "1.4",
    fontWeight: "normal",
    margin: "2px 0px 2px 0px",
  },
  containerStyle: {
    padding: "16px 16px 16px 16px",
    margin: "0px 0px 0px 0px",
    backgroundColor: "transparent",
    align: "center",
    borderWidth: "0px",
    borderStyle: "solid",
    borderColor: "transparent",
    borderRadius: "0px",
  },
};
