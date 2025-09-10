import {
  SitePageFitWidth,
  type SitePageWithRelations,
} from "@clayout/interface";
import { Block } from "../block";
import { forwardRef } from "react";

interface Props {
  page: SitePageWithRelations;
}

export const Page = forwardRef<HTMLDivElement, Props>(function Page(
  { page },
  ref
) {
  const { pageFit = "md" } = page.meta ?? {};

  return (
    <div
      ref={ref}
      style={{ width: "100%", maxWidth: SitePageFitWidth[pageFit] }}
    >
      {page.blocks.map((block) => (
        <Block key={block.id} block={block} />
      ))}
    </div>
  );
});
