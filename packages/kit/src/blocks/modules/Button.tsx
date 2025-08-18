import type { z } from "zod";
import { Block } from "../block";
import { SiteBlockTypes, ButtonBlockSchema } from "@clayout/interface";
import { getMaxWidth } from "../utils/getMaxWidth";
import { getComposedStyleString } from "../utils/getComposedStyleString";

export class ButtonBlock extends Block<z.infer<typeof ButtonBlockSchema>> {
  static readonly type = SiteBlockTypes.Button;

  renderToJsx() {
    const {
      margin = "0px 0px 0px 0px",
      align,
      ...restContainerStyles
    } = this.block.container_style ?? {};
    const { link, text } = this.block.data ?? {};

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
                <td align={align} valign="top" style={restContainerStyles}>
                  <a
                    style={{
                      ...this.block.style,
                      display: "inline-block",
                    }}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {text}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    );
  }

  renderToString() {
    const {
      margin = "0px 0px 0px 0px",
      align,
      ...restContainerStyles
    } = this.block.container_style ?? {};
    const { link, text } = this.block.data ?? {};

    const containerStyle = getComposedStyleString(restContainerStyles);

    const style = getComposedStyleString({
      ...this.block.style,
      display: "inline-block",
    });

    return `<tr>
              <td align="center" valign="top" style="width: 100%;">
                <table border="0" cellpadding="0" cellspacing="0" style="width: ${getMaxWidth(
                  "100%",
                  margin
                )}; margin: ${margin};">
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
