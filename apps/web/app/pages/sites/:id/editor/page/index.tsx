import { SitePageFitWidth } from "@clayout/interface";
import { Block } from "../block";
import { useSiteContext } from "../../contexts/site.context";
import { useBlockIdsForPage } from "@/lib/zustand/editor";

export function Page() {
  const { selectedPage } = useSiteContext();
  const blockIds = useBlockIdsForPage(selectedPage?.id);

  /** TODO: Empty UI */
  if (!selectedPage) {
    return null;
  }

  const { pageFit = "md" } = selectedPage.meta ?? {};

  return (
    <div style={{ width: "100%", maxWidth: SitePageFitWidth[pageFit] }}>
      {blockIds.map((blockId, blockIndex) => (
        <Block key={blockId} blockId={blockId} blockIndex={blockIndex} />
      ))}
    </div>
  );
}
