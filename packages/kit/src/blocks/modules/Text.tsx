import type { z } from "zod";
import { Block } from "../block";
import { SiteBlockTypes, TextBlockSchema } from "@clayout/interface";
import { getMaxWidth } from "../utils/getMaxWidth";
import { getComposedStyleString } from "../utils/getComposedStyleString";
import { getComposedStyleObject } from "../utils/getComposedStyleObject";

export class TextBlock extends Block<z.infer<typeof TextBlockSchema>> {
  static readonly type = SiteBlockTypes.Text;

  renderToJsx() {
    const { margin = "0px 0px 0px 0px", ...containerStyle } =
      this.block.containerStyle ?? {};
    const containerWidth = getMaxWidth("100%", margin);

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
    const { margin = "0px 0px 0px 0px", ...restContainerStyle } =
      this.block.containerStyle ?? {};
    const containerStyle = getComposedStyleString({
      ...restContainerStyle,
    });
    const textStyle = getComposedStyleString({
      ...this.block.style,
    });
    const containerWidth = getMaxWidth("100%", margin);

    return `<div style="width: ${containerWidth}; margin: ${margin}; ">
  <div style="${containerStyle}">
    <p style="word-break: break-word; ${textStyle}">${this.block.data?.value}</p>
  </div>    
</div>`;
  }

  renderToTable(): string {
    const { margin = "0px 0px 0px 0px", ...restContainerStyle } =
      this.block.containerStyle ?? {};
    const containerWidth = getMaxWidth("100%", margin);

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
          <td align="left" valign="top" style="${textStyle}" class="text">
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
  name: "Text Block",
  slug: "text-block",
  data: {
    value:
      "Everyone has the right to freedom of thought, conscience and religion; this right includes freedom to change his religion or belief, and freedom, either alone or in community with others and in public or private, to manifest his religion or belief in teaching, practice, worship and observance. Everyone has the right to freedom of opinion and expression; this right includes freedom to hold opinions without interference and to seek, receive and impart information and ideas through any media and regardless of frontiers. Everyone has the right to rest and leisure, including reasonable limitation of working hours and periodic holidays with pay.",
  },
  style: {
    color: "#1C2024",
    fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    fontSize: "16px",
    lineHeight: "1.4",
    fontWeight: "medium",
    margin: "2px 0px 2px 0px",
  },
  containerStyle: {
    padding: "16px 16px 16px 16px",
    backgroundColor: "white",
  },
};
