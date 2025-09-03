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
    content: 'body { background-color: beige; }',
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
