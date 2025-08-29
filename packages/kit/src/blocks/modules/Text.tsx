import type { z } from "zod";
import { Block } from "../block";
import { SiteBlockTypes, TextBlockSchema } from "@clayout/interface";
import { getMaxWidth } from "../utils/getMaxWidth";
import { getComposedStyleString } from "../utils/getComposedStyleString";

export class TextBlock extends Block<z.infer<typeof TextBlockSchema>> {
  static readonly type = SiteBlockTypes.Text;

  renderToJsx() {
    const { margin = "0px 0px 0px 0px", ...restContainerStyles } =
      this.block.containerStyle ?? {};

    return (
      <tr>
        <td align="center" valign="top" style={{ width: "100%" }}>
          <table
            cellPadding="0"
            cellSpacing="0"
            style={{ width: getMaxWidth("100%", margin), margin }}
          >
            <tbody>
              <tr>
                <td
                  align="left"
                  valign="top"
                  style={{
                    ...restContainerStyles,
                    ...this.block.style,
                  }}
                >
                  <p style={{ wordBreak: "break-word" }}>
                    {this.block.data?.value}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    );
  }

  renderToString() {
    const { margin = "0px 0px 0px 0px", ...restContainerStyles } =
      this.block.containerStyle ?? {};
    const style = getComposedStyleString({
      ...restContainerStyles,
      ...this.block.style,
    });

    return `<tr>
  <td align="center" valign="top" style="width: 100%;">
    <table border="0" cellpadding="0" cellspacing="0" style="width: ${getMaxWidth(
      "100%",
      margin
    )}; margin: ${margin};">
      <tbody>
        <tr>
          <td align="left" valign="top" style="${style}" class="text">
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
