import type { z } from "zod";
import { Block } from "../block";
import { SiteBlockTypes, TextBlockSchema } from "@clayout/interface";
import { getMaxWidth } from "../utils/getMaxWidth";
import { getComposedStyleString } from "../utils/getComposedStyleString";

export class TextBlock extends Block<z.infer<typeof TextBlockSchema>> {
  static readonly type = SiteBlockTypes.Text;

  // FIXME: remove table layout
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

  // FIXME: remove table layout
  renderToString(): string {
    return ``;
  }

  renderToTable(): string {
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

export const TextBlockData: z.infer<typeof TextBlockSchema> = {
  type: SiteBlockTypes.Text,
  name: "Text Block",
  slug: `text-block-${Date.now()}`,
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
