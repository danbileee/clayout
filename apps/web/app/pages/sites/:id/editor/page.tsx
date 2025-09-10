import {
  SitePageFitWidth,
  type SitePageWithRelations,
} from "@clayout/interface";
import { Block } from "./block";

interface Props {
  page: SitePageWithRelations;
}

export function Page({ page }: Props) {
  const { pageFit = "md" } = page.meta ?? {};

  return (
    <div style={{ width: "100%", maxWidth: SitePageFitWidth[pageFit] }}>
      {page.blocks.map((block) => (
        <Block key={block.id} block={block} />
      ))}
    </div>
  );
}
