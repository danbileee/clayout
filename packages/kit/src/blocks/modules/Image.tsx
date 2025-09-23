import type { z } from "zod";
import { Block } from "../block";
import { ImageBlockSchema, SiteBlockTypes } from "@clayout/interface";
import { getMaxWidth } from "../utils/getMaxWidth";
import { getComposedStyleString } from "../utils/getComposedStyleString";
import { getAlignStyle } from "../utils/getAlignStyle";
import { getComposedStyleObject } from "../utils/getComposedStyleObject";

export class ImageBlock extends Block<z.infer<typeof ImageBlockSchema>> {
  static readonly type = SiteBlockTypes.Image;

  renderToJsx() {
    const {
      width: cWidth,
      margin = "0px 0px 0px 0px",
      padding = "0px 0px 0px 0px",
      align,
      ...containerStyle
    } = this.block.containerStyle ?? {};
    const { width, ...style } = this.block.style ?? {};
    const { url, link, alt } = this.block.data ?? {};
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
            padding,
          }}
        >
          {link ? (
            <a
              href={link}
              style={{
                display: "inline-flex",
                width,
                maxWidth: "100%",
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                style={{
                  ...style,
                  width: "100%",
                  objectFit: "contain",
                }}
                src={url}
                alt={alt}
              />
            </a>
          ) : (
            <img
              style={{
                ...style,
                width,
                maxWidth: "100%",
                objectFit: "contain",
              }}
              src={url}
              alt={alt}
            />
          )}
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
    const { width, ...style } = this.block.style ?? {};
    const { url, link, alt } = this.block.data ?? {};
    const containerWidth = cWidth ?? getMaxWidth("100%", margin);
    const alignStyle = getAlignStyle({ align });

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
    const imageStyle = getComposedStyleString({
      ...style,
      width: link ? "100%" : width,
      maxWidth: "100%",
      objectFit: "contain",
    });

    return `<div style="${outerContainerStyle}">
  <div style="${innerContainerStyle}">
    ${
      link
        ? `   <a
      href="${link}"
      style="display: inline-flex; width: ${width};"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        style="${imageStyle}"
        src="${url}"
        alt="${alt}"
      />
    </a>`
        : `   <img
      style="${imageStyle}"
      src="${url}"
      alt="${alt}"
    />`
    }
  </div>
</div>`;
  }

  renderToTable(): string {
    const {
      width: cWidth,
      margin = "0px 0px 0px 0px",
      padding = "0px 0px 0px 0px",
      align,
      ...restContainerStyles
    } = this.block.containerStyle ?? {};
    const { width } = this.block.style ?? {};
    const { url, link, alt } = this.block.data ?? {};
    const containerWidth = cWidth ?? getMaxWidth("100%", margin);

    const outerContainerStyle = getComposedStyleString({
      width: containerWidth,
      margin,
    });
    const innerContainerStyle = getComposedStyleString({
      ...restContainerStyles,
      padding,
    });
    const imageContainerStyle = getComposedStyleString({
      width,
      maxWidth: getMaxWidth("100vw", padding),
    });

    return `<tr>
  <td align="center" valign="top" style="width: 100%;">
    <table border="0" cellpadding="0" cellspacing="0" style="${outerContainerStyle}">
      <tbody>
        <tr>
          <td align="${align}" valign="top" style="${innerContainerStyle}" class="image">
            <table border="0" cellpadding="0" cellspacing="0" style="${imageContainerStyle}">
              <tbody>
                <tr>
                  <td align="center" valign="top">
                    ${
                      link
                        ? `<a href="${link}" style="display: table; width: 100%;" target="_blank" rel="noopener noreferrer">
                      <img style="display: table-cell; width: 100%; object-fit: contain;" src="${url}" alt="${alt}"/>
                    </a>`
                        : `<img style="display: table-cell; width: 100%; object-fit: contain;" src="${url}" alt="${alt}"/>`
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </td>
</tr>`;
  }
}

export const ImageBlockData: z.infer<typeof ImageBlockSchema> = {
  type: SiteBlockTypes.Image,
  name: "Image Block",
  slug: "image-block",
  data: {
    url: "https://i.ytimg.com/vi/fK9CNdJK9lo/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLA2y_V7p3K3rc1MT0byoni-LpQoVA",
    link: "https://youtu.be/CGC0BhQwnik?si=XGgxXwxqDl2dsJAy",
    alt: "Blackberry Creme Brulee",
  },
  style: {
    width: "100%",
  },
  containerStyle: {
    padding: "20px 20px 20px 20px",
    backgroundColor: "black",
  },
};
