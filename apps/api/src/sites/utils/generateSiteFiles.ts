import { SiteEntity } from '../entities/site.entity';
import { SiteFile } from '../interfaces/site.interface';
import { renderSiteBlocks } from './renderSiteBlocks';

export function generateSiteFiles(site: SiteEntity): SiteFile[] {
  const files: SiteFile[] = [];

  // TODO: page에 home 속성 추가하고 맨 앞으로 정렬

  for (const page of site.pages) {
    const html = renderSiteBlocks({ site, page });

    files.push({
      name: `${page.slug}.html`,
      content: html,
      contentType: 'text/html',
    });
  }

  files.push({
    name: 'styles.css',
    content: 'body { background-color: beige; }',
    contentType: 'text/css',
  });

  return files;
}
