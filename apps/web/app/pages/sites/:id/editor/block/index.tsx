import { BlockRegistry } from "@clayout/kit";
import { SiteBlockSchema } from "@clayout/interface";
import { css, styled } from "styled-components";
import type { MouseEvent } from "react";
import { useBlockById } from "@/lib/zustand/editor";
import * as Tooltip from "@/components/ui/tooltip";
import { HFlexBox } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  IconArrowDown,
  IconArrowsMove,
  IconArrowUp,
  IconBookmark,
  IconCopy,
  IconTrash,
} from "@tabler/icons-react";
import { rem } from "@/utils/rem";
import { useSiteContext } from "@/pages/sites/:id/contexts/site.context";

interface Props {
  blockId: string;
}

export function Block({ blockId }: Props) {
  const { page, block, openBlockEditor } = useSiteContext();
  const blockSchema = useBlockById(blockId);
  const matchedBlock = page?.blocks.find((b) => b.id === blockSchema.id);
  const parsedBlock = SiteBlockSchema.parse(blockSchema);
  const registerdBlock = new BlockRegistry().find(parsedBlock);
  const selected = block === matchedBlock;

  const handleClickBlock = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (!matchedBlock || selected) return;

    openBlockEditor(matchedBlock);
  };

  return (
    <BlockBase onClick={handleClickBlock}>
      {registerdBlock.renderToJsx()}
      <BlockCover selected={selected}>
        <BlockButtons gap={4}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button isSquare level="secondary">
                <Icon size={14}>{IconArrowsMove}</Icon>
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>Drag to move</Tooltip.Content>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button isSquare level="secondary">
                <Icon size={14}>{IconArrowUp}</Icon>
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>Move up</Tooltip.Content>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button isSquare level="secondary">
                <Icon size={14}>{IconArrowDown}</Icon>
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>Move down</Tooltip.Content>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button isSquare level="secondary">
                <Icon size={14}>{IconCopy}</Icon>
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>Duplicate</Tooltip.Content>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button isSquare level="secondary">
                <Icon size={14}>{IconBookmark}</Icon>
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>Save</Tooltip.Content>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button isSquare level="secondary">
                <Icon size={14}>{IconTrash}</Icon>
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>Remove</Tooltip.Content>
          </Tooltip.Root>
        </BlockButtons>
      </BlockCover>
    </BlockBase>
  );
}

const BlockBase = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  display: flow-root;
  box-sizing: content-box;
`;

interface BlockCoverProps {
  selected: boolean;
}

const BlockCover = styled.div.withConfig({
  shouldForwardProp: (prop) => {
    const nonForwardedProps = ["selected"];

    return !nonForwardedProps.includes(prop);
  },
})<BlockCoverProps>`
  ${({ theme, selected }) => css`
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: transparent;
    border: 2px solid transparent;
    z-index: 1;
    transition: border-color ease-in-out 150ms;

    &:hover {
      border-color: ${theme.colors.blue[600]};

      > div {
        opacity: 0.99;
      }
    }

    ${selected &&
    css`
      border: 2px dashed ${theme.colors.blue[600]};

      &:hover {
        border: 2px dashed ${theme.colors.blue[600]};

        > div {
          opacity: 0.99;
        }
      }
    `}
  `}
`;

const BlockButtons = styled(HFlexBox)`
  position: absolute;
  top: ${rem(-14)};
  right: ${rem(6)};
  z-index: 2;
  opacity: 0;
  transition: opacity ease-in-out 150ms;
`;
