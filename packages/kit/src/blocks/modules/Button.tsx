import type { z } from "zod";
import { Block } from "../block";
import { SiteBlockTypes, ButtonBlockSchema } from "@clayout/interface";
import { getMaxWidth } from "../utils/getMaxWidth";
import { getComposedStyleString } from "../utils/getComposedStyleString";
import { getAlignStyle } from "../utils/getAlignStyle";

export class ButtonBlock extends Block<z.infer<typeof ButtonBlockSchema>> {
  static readonly type = SiteBlockTypes.Button;

  renderToJsx() {
    const {
      margin = "0px 0px 0px 0px",
      padding = "0px 0px 0px 0px",
      align,
      ...containerStyle
    } = this.block.containerStyle ?? {};
    const { ...style } = this.block.style ?? {};
    const { link, text } = this.block.data ?? {};
    const containerWidth = getMaxWidth("100%", margin);
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
            width: "100%",
            padding,
            ...containerStyle,
            ...alignStyle,
          }}
        >
          <a
            style={{
              ...style,
              display: "inline-flex",
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
      margin = "0px 0px 0px 0px",
      padding = "0px 0px 0px 0px",
      align,
      ...containerStyle
    } = this.block.containerStyle ?? {};
    const { ...style } = this.block.style ?? {};
    const { link, text } = this.block.data ?? {};
    const containerWidth = getMaxWidth("100%", margin);
    const alignStyle = getAlignStyle({ align });

    const outerContainerStyle = getComposedStyleString({
      width: containerWidth,
      margin,
    });
    const innerContainerStyle = getComposedStyleString({
      width: "100%",
      padding,
      ...containerStyle,
      ...alignStyle,
    });
    const buttonStyle = getComposedStyleString({
      display: "inline-flex",
      ...style,
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
