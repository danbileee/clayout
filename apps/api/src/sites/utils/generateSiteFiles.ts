import { SiteEntity } from '../entities/site.entity';
import { SiteFile } from '../interfaces/site.interface';
import { renderSiteBlocks } from './renderSiteBlocks';
import { SiteDomainEntity } from '../entities/site-domain.entity';

interface Options {
  favicon?: Buffer;
}

export async function generateSiteFiles(
  site: SiteEntity,
  domain: SiteDomainEntity,
  options?: Options,
): Promise<SiteFile[]> {
  const { favicon } = options ?? {};
  const files: SiteFile[] = [];
  const hasFavicon = Boolean(favicon);

  for (const page of site.pages) {
    if (page.isVisible) {
      const html = renderSiteBlocks({
        site,
        page,
        domain,
        options: {
          hasFavicon,
        },
      });

      files.push({
        name: page.isHome ? 'index.html' : `${page.slug}.html`,
        content: html,
        contentType: 'text/html',
      });
    }
  }

  files.push({
    name: 'styles.css',
    content: cssBase,
    contentType: 'text/css',
  });

  if (hasFavicon) {
    files.push({
      name: 'favicon.ico',
      content: favicon,
      contentType: 'image/x-icon',
    });
  }

  return files;
}

const cssBase = `
  body {
    margin: 0;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                Helvetica, Arial, sans-serif, "Apple Color Emoji",
                "Segoe UI Emoji", "Segoe UI Symbol";
    font-synthesis: none;
    font-display: swap;
  }

  hr {
    box-sizing: content-box;
    height: 0;
    overflow: visible;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  a {
    text-decoration: none;
    margin: 0;
  }

  button {
    cursor: pointer;
  }

  ol,
  ul,
  li {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit;
    margin: 0;
  }

  label {
    font-size: 14px;
  }

  select {
    outline: none;
  }

  input:focus {
    outline: none;
  }

  textarea {
    box-shadow: none;
    resize: none;
  }

  textarea:focus {
    outline: none;
  }

  sub,
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }

  img {
    border-style: none;
  }

  code,
  kbd,
  samp,
  pre {
    font-family: 'Lucida Console', 'Monaco', monospace;
  }
`;
