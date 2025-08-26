import { SiteBlockSchema } from '@clayout/interface';
import { BlockRegistry } from '@clayout/kit';
import { SitePageEntity } from '../entities/site-page.entity';
import { SiteEntity } from '../entities/site.entity';

interface Params {
  site: SiteEntity;
  page: SitePageEntity;
}

export function renderSiteBlocks({ site, page }: Params): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${site.name}</title>
  </head>
  <body>
    <table cellPadding="0" cellSpacing="0" style={{ width: "768px" }}>
      <tbody>
        ${page.blocks
          .map((block) => {
            const parsedBlock = SiteBlockSchema.parse(block);
            const matchedBlock = new BlockRegistry().find(parsedBlock);

            return matchedBlock.renderToString();
          })
          .join(`\n`)}
      </tbody>
    </table>
  </body>
</html>`;
}
