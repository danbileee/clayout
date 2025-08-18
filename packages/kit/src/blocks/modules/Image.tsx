import type { z } from "zod";
import { Block } from "../block";
import { ImageBlockSchema, SiteBlockTypes } from "@clayout/interface";
import { getMaxWidth } from "../utils/getMaxWidth";
import { getComposedStyleString } from "../utils/getComposedStyleString";

export class ImageBlock extends Block<z.infer<typeof ImageBlockSchema>> {
  static readonly type = SiteBlockTypes.Image;

  renderToJsx() {
    const {
      margin = "0px 0px 0px 0px",
      padding = "0px 0px 0px 0px",
      align,
      ...restContainerStyles
    } = this.block.container_style ?? {};
    const { width } = this.block.style ?? {};
    const { url, link, alt } = this.block.data ?? {};

    return (
      <tr>
        <td align="center" valign="top" style={{ width: "100%" }}>
          <table
            cellPadding="0"
            cellSpacing="0"
            style={{
              width: getMaxWidth("100%", margin),
              margin,
            }}
          >
            <tbody>
              <tr>
                <td
                  align={align}
                  valign="top"
                  style={{ ...restContainerStyles, padding }}
                >
                  <table
                    cellPadding="0"
                    cellSpacing="0"
                    style={{
                      width,
                      maxWidth: getMaxWidth("100vw", padding),
                    }}
                  >
                    <tbody>
                      <tr>
                        <td align="center" valign="top">
                          {link ? (
                            <a
                              href={link}
                              style={{
                                display: "table",
                                width: "100%",
                              }}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                style={{
                                  display: "table-cell",
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
                                display: "table-cell",
                                width: "100%",
                                objectFit: "contain",
                              }}
                              src={url}
                              alt={alt}
                            />
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
      padding = "0px 0px 0px 0px",
      align,
      ...restContainerStyles
    } = this.block.container_style ?? {};
    const { width } = this.block.style ?? {};
    const { url, link, alt } = this.block.data ?? {};

    const style = getComposedStyleString({ ...restContainerStyles, padding });

    return `
                <tr>
                  <td align="center" valign="top" style="width: 100%;">
                    <table border="0" cellpadding="0" cellspacing="0" style="width: ${getMaxWidth(
                      "100%",
                      margin
                    )}; margin: ${margin};">
                      <tbody>
                        <tr>
                          <td align="${align}" valign="top" style="${style}" class="image">
                            <table border="0" cellpadding="0" cellspacing="0" style="width: ${width}; max-width: ${getMaxWidth(
      "100vw",
      padding
    )};">
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
