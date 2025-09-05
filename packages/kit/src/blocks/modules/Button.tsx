import type { z } from "zod";
import { Block } from "../block";
import { SiteBlockTypes, ButtonBlockSchema } from "@clayout/interface";
import { getMaxWidth } from "../utils/getMaxWidth";
import { getComposedStyleString } from "../utils/getComposedStyleString";

export class ButtonBlock extends Block<z.infer<typeof ButtonBlockSchema>> {
  static readonly type = SiteBlockTypes.Button;

  // FIXME: remove table layout
  renderToJsx() {
    const {
      margin = "0px 0px 0px 0px",
      align,
      ...restContainerStyles
    } = this.block.containerStyle ?? {};
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

  // FIXME: remove table layout
  renderToString(): string {
    return ``;
  }

  renderToTable(): string {
    const {
      margin = "0px 0px 0px 0px",
      align,
      ...restContainerStyles
    } = this.block.containerStyle ?? {};
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

export const ButtonBlockData: z.infer<typeof ButtonBlockSchema> = {
  type: SiteBlockTypes.Button,
  name: "Button Block",
  slug: `button-block-${Date.now()}`,
  data: {
    link: "https://www.youtube.com/@lifeisworship.studio",
    text: "View Channel",
  },
  style: {
    backgroundColor: "white",
    padding: "8px 10px 8px 10px",
    color: "black",
    fontFamily: `"Libertinus Sans", sans-serif`,
    fontSize: "24px",
    fontWeight: "bold",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "red",
    borderRadius: "8px",
    textDecoration: "underline",
    textAlign: "right",
  },
  containerStyle: {
    padding: "20px 20px 20px 20px",
    backgroundColor: "black",
  },
};
