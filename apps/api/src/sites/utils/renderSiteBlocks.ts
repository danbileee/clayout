import { SiteBlockSchema, SitePageSchema } from '@clayout/interface';
import { BlockRegistry, PageRenderer } from '@clayout/kit';
import { SitePageEntity } from '../entities/site-page.entity';
import { SiteEntity } from '../entities/site.entity';
import { SiteDomainEntity } from '../entities/site-domain.entity';
import { BadRequestException } from '@nestjs/common';

interface Options {
  hasFavicon?: boolean;
}

interface Params {
  site: SiteEntity;
  page: SitePageEntity;
  domain: SiteDomainEntity;
  options?: Options;
}

export function renderSiteBlocks({
  site,
  domain,
  page,
  options,
}: Params): string {
  const { hasFavicon = false } = options ?? {};
  const title = `${site.name} | ${page.name}`;
  const description = page.meta?.description ?? site.meta?.description;
  const ogImagePath = page.meta?.ogImagePath ?? site.meta?.ogImagePath;
  const path = page.isHome ? '' : `/${page.slug}`;
  const url = `https://${domain.hostname}${path}`;
  const parsedPage = SitePageSchema.safeParse(page);

  if (parsedPage.error) {
    throw new BadRequestException(
      `RENDERING FAILED: Page data is invalid.\n${JSON.stringify(parsedPage.error)}`,
    );
  }

  const renderer = PageRenderer.renderToString(parsedPage.data);

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta property="og:type" content="${site.category}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" name="title" content="${title}" />
    ${description ? `<meta property="og:description" name="description" content="${description}" />` : ''}
    <meta property="og:site_name" content="${site.name}" />
    <meta property="og:locale" content="ko_KR" />
    ${
      ogImagePath
        ? `
    <meta property="og:image" content="${ogImagePath}" />
    <meta property="og:image:width" content="400" />
    <meta property="og:image:height" content="224" />`
        : ''
    }
    <link rel="canonical" href="${url}" />
    ${hasFavicon ? `<link rel="icon" href="./favicon.ico" />` : ''}
    <link rel="stylesheet" href="./styles.css" type="text/css" />
  </head>
  <body>
    ${renderer(
      page.blocks
        .map((block) => {
          const parsedBock = SiteBlockSchema.safeParse(block);

          if (parsedBock.error) {
            throw new BadRequestException(
              `RENDERING FAILED: Block data is invalid.\n${JSON.stringify(parsedBock.error)}`,
            );
          }

          const matchedBlock = new BlockRegistry().find(parsedBock.data);

          return matchedBlock.renderToString();
        })
        .join(`\n`),
    )}
  </body>
</html>`;
}
