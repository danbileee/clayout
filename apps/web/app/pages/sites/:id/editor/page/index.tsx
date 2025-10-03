import { css, styled, useTheme } from "styled-components";
import { IconCubeSpark, IconEdit } from "@tabler/icons-react";
import { SitePageSchema } from "@clayout/interface";
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
import { useState, type MouseEvent } from "react";
import { PageRenderer } from "@clayout/kit";

interface Props {
  headerHeight: number;
}

export function Page({ headerHeight }: Props) {
  const theme = useTheme();
  const { selectedPage, menu, setMenu, closeBlockEditor, openPageEditor } =
    useSiteContext();
  const blockIds = useBlockIdsForPage(selectedPage?.id);
  const [hovering, setHovering] = useState(false);

  const handleClickOutsidePage = () => {
    if (menu === SiteMenus.Block) {
      closeBlockEditor();
    }
  };

  const handleMouseEnter = () => {
    if (!hovering) {
      setHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (hovering) {
      setHovering(false);
    }
  };

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
      "No selected page in this context. This is not an expected situation."
    );
    return null;
  }

  const parsed = SitePageSchema.parse(selectedPage);
  const PageComponent = PageRenderer.renderToJsx(parsed);

  return (
    <PageWrapper
      headerHeight={headerHeight}
      onClick={handleClickOutsidePage}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {blockIds.length ? (
        <PageComponent>
          {blockIds.map((blockId, blockIndex) => (
            <Block key={blockId} blockId={blockId} blockIndex={blockIndex} />
          ))}
        </PageComponent>
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
      )}
      {selectedPage && (
        <Tooltip.Root>
          <Tooltip.Trigger>
            <StyledButton
              hovering={hovering}
              isSquare
              level="secondary"
              onClick={handleClickEditPage}
            >
              <Icon>{IconEdit}</Icon>
            </StyledButton>
          </Tooltip.Trigger>
          <Tooltip.Content align="end">Edit page properties</Tooltip.Content>
        </Tooltip.Root>
      )}
    </PageWrapper>
  );
}

interface PageWrapperProps {
  headerHeight: number;
}

const PageWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => {
    const nonForwardedProps = ["headerHeight"];

    return !nonForwardedProps.includes(prop);
  },
})<PageWrapperProps>`
  ${({ headerHeight }) => css`
    width: 100%;
    height: 100%;
    min-height: calc(100svh - ${rem(headerHeight)});
    margin-top: ${rem(headerHeight)};
    overflow-y: auto;
  `}
`;

interface StyledButtonProps {
  hovering: boolean;
}

const StyledButton = styled(Button).withConfig({
  shouldForwardProp: (prop) => {
    const nonForwardedProps = ["hovering"];

    return !nonForwardedProps.includes(prop);
  },
})<StyledButtonProps>`
  ${({ hovering }) => css`
    position: fixed;
    bottom: ${rem(20)};
    right: ${rem(20)};
    opacity: ${hovering ? 0.99 : 0};
    transition: opacity ease-in-out 150ms;
  `}
`;
