import { css, styled } from "styled-components";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { BlockRegistry } from "@clayout/kit";
import { SiteBlockSchema, type SiteBlock } from "@clayout/interface";
import {
  useAddBlock,
  useBlockById,
  useRemoveBlock,
  useReorderBlock,
} from "@/lib/zustand/editor";
import * as Tooltip from "@/components/ui/tooltip";
import { HFlexBox } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  IconArrowDown,
  // IconArrowsMove,
  IconArrowUp,
  // IconBookmark,
  IconCopy,
  IconTrash,
} from "@tabler/icons-react";
import { rem } from "@/utils/rem";
import { useSiteContext } from "@/pages/sites/:id/contexts/site.context";
import { useClientMutation } from "@/lib/react-query/useClientMutation";
import { postSiteBlockReorder } from "@/apis/sites/pages/blocks/reorder";
import { postSiteBlockDuplicate } from "@/apis/sites/pages/blocks/duplicate";
import { deleteSiteBlocks } from "@/apis/sites/pages/blocks";
import { handleError } from "@/lib/axios/handleError";
import { useDialog } from "@/components/ui/dialog";
import { ConfirmDeleteDialog } from "@/components/shared/dialogs/confirm/delete";
import { useTimer } from "@/hooks/useTimer";
import { toast } from "sonner";

interface Props {
  blockId: string;
  blockIndex: number;
}

export function Block({ blockId, blockIndex }: Props) {
  const blockRef = useRef<HTMLDivElement>(null);
  const timer = useTimer();
  const [duplicatedBlockId, setDuplicatedBlockId] = useState<number | null>(
    null
  );
  const { openDialog, closeDialog } = useDialog();
  const {
    site,
    selectedPage,
    selectedBlock,
    closeBlockEditor,
    openBlockEditor,
    invalidateSiteCache,
  } = useSiteContext();
  const blockSchema = useBlockById(blockId);
  const reorderBlocksLocally = useReorderBlock();
  const removeBlocksLocally = useRemoveBlock();
  const addBlocksLocally = useAddBlock();
  const { mutateAsync: reorderBlocks } = useClientMutation({
    mutationFn: postSiteBlockReorder,
  });
  const { mutateAsync: duplicateBlock } = useClientMutation({
    mutationFn: postSiteBlockDuplicate,
  });
  const { mutateAsync: deleteBlock, isPending: isDeleting } = useClientMutation(
    {
      mutationFn: deleteSiteBlocks,
    }
  );

  const matchedBlock = selectedPage?.blocks.find(
    (b) => b.id === blockSchema.id
  );
  const parsedBlock = SiteBlockSchema.parse(blockSchema);
  const registerdBlock = new BlockRegistry().find(parsedBlock);
  const selected = selectedBlock === matchedBlock;

  const handleClickBlock = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (!matchedBlock || selected) return;

    openBlockEditor(matchedBlock.id);
  };

  const handleReorder = async (
    matchedBlock: SiteBlock,
    targetBlock: SiteBlock
  ) => {
    const fn = async () => {
      if (!site?.id || !selectedPage?.id) {
        throw new Error(`siteId and pageId are required.`);
      }

      reorderBlocksLocally(selectedPage.id, matchedBlock.id, targetBlock.id);

      await reorderBlocks({
        params: {
          siteId: site.id,
          pageId: selectedPage.id,
          sourceId: matchedBlock.id,
          targetId: targetBlock.id,
        },
      });
      await invalidateSiteCache();
    };

    try {
      await fn();
    } catch (e) {
      const { error } = await handleError(e, {
        onRetry: fn,
      });

      if (error) {
        throw error;
      }
    }
  };

  const handleMoveDown = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const targetIndex = blockIndex + 1;
    const targetBlock = selectedPage?.blocks?.[targetIndex];

    if (!targetBlock) {
      throw new Error(
        `targetBlock not found for the given index: ${targetIndex}`
      );
    }

    if (!matchedBlock) {
      throw new Error(
        `matchedBlock not found for the given index: ${blockIndex}`
      );
    }

    await handleReorder(matchedBlock, targetBlock);
  };

  const handleMoveUp = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const targetIndex = blockIndex - 1;
    const targetBlock = selectedPage?.blocks?.[targetIndex];

    if (!targetBlock) {
      throw new Error(
        `targetBlock not found for the given index: ${targetIndex}`
      );
    }

    if (!matchedBlock) {
      throw new Error(
        `matchedBlock not found for the given index: ${blockIndex}`
      );
    }

    await handleReorder(matchedBlock, targetBlock);
  };

  const handleDuplicate = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const fn = async () => {
      if (!site?.id || !selectedPage?.id) {
        throw new Error(`siteId and pageId are required.`);
      }

      if (!matchedBlock) {
        throw new Error(
          `matchedBlock not found for the given index: ${blockIndex}`
        );
      }

      const response = await duplicateBlock({
        params: {
          siteId: site.id,
          pageId: selectedPage.id,
          blockId: matchedBlock.id,
        },
      });

      const parsed = SiteBlockSchema.safeParse(response.data.block);

      if (parsed.success) {
        addBlocksLocally(selectedPage.id, parsed.data);
      }

      await invalidateSiteCache();

      setDuplicatedBlockId(response.data.block.id);
    };

    try {
      await fn();
    } catch (e) {
      const { error } = await handleError(e, {
        onRetry: fn,
      });

      if (error) {
        throw error;
      }
    }
  };

  const handleDelete = async () => {
    const fn = async () => {
      if (!site?.id || !selectedPage?.id) {
        throw new Error(`siteId and pageId are required.`);
      }

      if (!matchedBlock) {
        throw new Error(
          `matchedBlock not found for the given index: ${blockIndex}`
        );
      }

      closeBlockEditor();
      removeBlocksLocally(selectedPage.id, matchedBlock.id);

      await deleteBlock({
        params: {
          siteId: site.id,
          pageId: selectedPage.id,
          blockId: matchedBlock.id,
        },
      });

      if (selected) {
        closeBlockEditor();
      }

      await invalidateSiteCache();

      toast.success("Deleted successfully.");
    };

    try {
      await fn();
    } catch (e) {
      const { error } = await handleError(e, {
        onRetry: fn,
      });

      if (error) {
        throw error;
      }
    }
  };

  const handleConfirmDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    openDialog(
      <ConfirmDeleteDialog
        title="Delete this block?"
        confirmButtonProps={{
          isLoading: isDeleting,
          onClick: () => {
            handleDelete();
            closeDialog();
          },
        }}
      />
    );
  };

  /**
   * @useEffect
   * Open duplicated block in the editor after some amount of delay
   * because the site data isn't updated right after duplication success
   */
  useEffect(() => {
    if (duplicatedBlockId) {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => {
        openBlockEditor(duplicatedBlockId);
        setDuplicatedBlockId(null);
      }, 100);
    }

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [duplicatedBlockId, openBlockEditor, timer]);

  /**
   * @useEffect
   * Automatically scroll into view when this block is selected
   */
  useEffect(() => {
    if (selected) {
      blockRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selected]);

  return (
    <BlockBase ref={blockRef} onClick={handleClickBlock}>
      {registerdBlock.renderToJsx()}
      <BlockCover selected={selected}>
        <BlockButtons gap={4}>
          {/* <Tooltip.Root>
            <Tooltip.Trigger>
              <Button isSquare level="secondary">
                <Icon size={14}>{IconArrowsMove}</Icon>
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>Drag to move</Tooltip.Content>
          </Tooltip.Root> */}
          {(matchedBlock?.order ?? 0) > 0 && (
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Button isSquare level="secondary" onClick={handleMoveUp}>
                  <Icon size={14}>{IconArrowUp}</Icon>
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>Move up</Tooltip.Content>
            </Tooltip.Root>
          )}
          {(matchedBlock?.order ?? 0) <
            (selectedPage?.blocks.length ?? 0) - 1 && (
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Button isSquare level="secondary" onClick={handleMoveDown}>
                  <Icon size={14}>{IconArrowDown}</Icon>
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>Move down</Tooltip.Content>
            </Tooltip.Root>
          )}
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button isSquare level="secondary" onClick={handleDuplicate}>
                <Icon size={14}>{IconCopy}</Icon>
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>Duplicate</Tooltip.Content>
          </Tooltip.Root>
          {/* <Tooltip.Root>
            <Tooltip.Trigger>
              <Button isSquare level="secondary">
                <Icon size={14}>{IconBookmark}</Icon>
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>Save</Tooltip.Content>
          </Tooltip.Root> */}
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button isSquare level="secondary" onClick={handleConfirmDelete}>
                <Icon size={14}>{IconTrash}</Icon>
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>Delete</Tooltip.Content>
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
