import { SiteBlockSchema, SitePageFitWidth } from '@clayout/interface';
import { BlockRegistry } from '@clayout/kit';
import { SitePageEntity } from '../entities/site-page.entity';
import { SiteEntity } from '../entities/site.entity';
import { SiteDomainEntity } from '../entities/site-domain.entity';
import { EnvKeys } from 'src/shared/constants/env.const';
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
  const assetsDomain = process.env[EnvKeys.CF_R2_ASSETS_DOMAIN];
  const ogImage =
    ogImagePath && assetsDomain ? `${assetsDomain}/${ogImagePath}` : '';
  const path = page.isHome ? '' : `/${page.slug}`;
  const url = `https://${domain.hostname}${path}`;
  const maxWidth = SitePageFitWidth[page.containerStyle?.pageFit ?? 'sm'];

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta property="og:type" content=${site.category} />
    <meta property="og:url" content=${url} />
    <meta property="og:title" name="title" content=${title} />
    ${description ? `<meta property="og:description" name="description" content=${description} />` : ''}
    <meta property="og:site_name" content=${site.name} />
    <meta property="og:locale" content="ko_KR" />
    ${
      ogImage
        ? `
    <meta property="og:image" content=${ogImage} />
    <meta property="og:image:width" content="400" />
    <meta property="og:image:height" content="224" />`
        : ''
    }
    <link rel="canonical" href="${url}" />
    ${hasFavicon ? `<link rel="icon" href="./favicon.ico" />` : ''}
    <link rel="stylesheet" href="./styles.css" type="text/css" />
  </head>
  <body>
    <main style="width: 100%; max-width: ${maxWidth}; margin: 0 auto;">
      ${page.blocks
        .map((block) => {
          const parsed = SiteBlockSchema.safeParse(block);

          if (parsed.error) {
            throw new BadRequestException(
              `RENDERING FAILED: Block data is invalid`,
            );
          }

          const matchedBlock = new BlockRegistry().find(parsed.data);

          return matchedBlock.renderToString();
        })
        .join(`\n`)}
    </main>
  </body>
</html>`;
}
