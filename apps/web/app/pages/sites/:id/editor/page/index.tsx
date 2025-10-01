import { styled, useTheme } from "styled-components";
import { IconCubeSpark, IconEdit } from "@tabler/icons-react";
import { SitePageFitWidth, SitePageSchema } from "@clayout/interface";
import {
  SiteMenus,
  useSiteContext,
} from "@/pages/sites/:id/contexts/site.context";
import { useBlockIdsForPage } from "@/lib/zustand/editor";
import { EmptyPlaceholder } from "@/components/shared/placeholder/empty";
import * as Typo from "@/components/ui/typography";
import * as Tooltip from "@/components/ui/tooltip";
import { Block } from "../block";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { rem } from "@/utils/rem";
import type { MouseEvent } from "react";

export function Page() {
  const theme = useTheme();
  const { selectedPage, setMenu, openPageEditor } = useSiteContext();
  const blockIds = useBlockIdsForPage(selectedPage?.id);

  const handleClickBlocksPanel = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setMenu(SiteMenus.Blocks);
  };

  const handleClickEditPage = (e: MouseEvent<HTMLButtonElement>) => {
    if (!selectedPage) return;
    e.stopPropagation();
    openPageEditor(selectedPage.id);
  };

  if (!selectedPage) {
    console.warn(
      "No selected page in the site context. This is not an expected situation."
    );
    return null;
  }

  const parsed = SitePageSchema.parse(selectedPage);
  const { pageFit = "sm" } = parsed.containerStyle ?? {};

  return blockIds.length ? (
    <Canvas>
      <div style={{ width: "100%", maxWidth: SitePageFitWidth[pageFit] }}>
        {blockIds.map((blockId, blockIndex) => (
          <Block key={blockId} blockId={blockId} blockIndex={blockIndex} />
        ))}
      </div>
      {selectedPage && (
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Button
              isSquare
              level="secondary"
              style={{ position: "fixed", bottom: rem(20), right: rem(20) }}
              onClick={handleClickEditPage}
            >
              <Icon>{IconEdit}</Icon>
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content align="end">Edit page properties</Tooltip.Content>
        </Tooltip.Root>
      )}
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
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
`;
