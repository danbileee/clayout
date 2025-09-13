import { SitePageFitWidth } from "@clayout/interface";
import { Block } from "../block";
import { useSiteContext } from "../../contexts/site.context";
import { useBlockIdsForPage } from "@/lib/zustand/editor";

export function Page() {
  const { page } = useSiteContext();
  const blockIds = useBlockIdsForPage(page?.id);

  if (!page) {
    return null;
  }

  const { pageFit = "md" } = page.meta ?? {};

  return (
    <div style={{ width: "100%", maxWidth: SitePageFitWidth[pageFit] }}>
      {blockIds.map((blockId) => (
        <Block key={blockId} blockId={blockId} />
      ))}
    </div>
  );
}
