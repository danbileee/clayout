import { styled, useTheme } from "styled-components";
import { IconCubeSpark } from "@tabler/icons-react";
import { SitePageFitWidth } from "@clayout/interface";
import {
  SiteMenus,
  useSiteContext,
} from "@/pages/sites/:id/contexts/site.context";
import { useBlockIdsForPage } from "@/lib/zustand/editor";
import { EmptyPlaceholder } from "@/components/shared/placeholder/empty";
import * as Typo from "@/components/ui/typography";
import { Block } from "../block";

export function Page() {
  const theme = useTheme();
  const { selectedPage, setMenu } = useSiteContext();
  const blockIds = useBlockIdsForPage(selectedPage?.id);

  const handleClickBlocksPanel = () => {
    setMenu(SiteMenus.Blocks);
  };

  if (!selectedPage) {
    console.warn(
      "No selected page in the site context. This is not expected situation."
    );
    return null;
  }

  const { pageFit = "md" } = selectedPage.meta ?? {};

  return blockIds.length ? (
    <Canvas>
      <div style={{ width: "100%", maxWidth: SitePageFitWidth[pageFit] }}>
        {blockIds.map((blockId, blockIndex) => (
          <Block key={blockId} blockId={blockId} blockIndex={blockIndex} />
        ))}
      </div>
    </Canvas>
  ) : (
    <EmptyPlaceholder icon={IconCubeSpark}>
      <Typo.P color={theme.colors.slate[400]}>
        Choose a block from the{" "}
        <span
          className="underline underline-offset-4 cursor-pointer"
          onClick={handleClickBlocksPanel}
        >
          blocks panel
        </span>
        .
      </Typo.P>
    </EmptyPlaceholder>
  );
}

const Canvas = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
`;
