import { useRef } from "react";
import { toast } from "sonner";
import { CommandTypes, type CommandResult } from "@/lib/zustand/commands";
import { useUndo, useRedo, useCanUndo, useCanRedo } from "@/lib/zustand/editor";
import { useSiteContext } from "@/pages/sites/:id/contexts/site.context";
import { handleError } from "@/lib/axios/handleError";
import { useClientMutation } from "@/lib/react-query/useClientMutation";
import {
  deleteSiteBlocks,
  patchSiteBlocks,
  postSiteBlocks,
} from "@/apis/sites/pages/blocks";
import { postSiteBlockReorder } from "@/apis/sites/pages/blocks/reorder";

export function useEditorHistory() {
  const { site, selectedPageId, invalidateSiteCache } = useSiteContext();
  const undo = useUndo();
  const redo = useRedo();
  const canUndo = useCanUndo(selectedPageId || 0);
  const canRedo = useCanRedo(selectedPageId || 0);
  const { mutateAsync: updateBlock } = useClientMutation({
    mutationFn: patchSiteBlocks,
  });
  const { mutateAsync: deleteBlock } = useClientMutation({
    mutationFn: deleteSiteBlocks,
  });
  const { mutateAsync: createBlock } = useClientMutation({
    mutationFn: postSiteBlocks,
  });
  const { mutateAsync: reorderBlock } = useClientMutation({
    mutationFn: postSiteBlockReorder,
  });

  const updateDB = useRef(async (result: CommandResult | null) =>
    toast.promise(
      async () => {
        const fn = async () => {
          if (!site?.id) {
            throw new Error("siteId is required.");
          }
          if (!result) {
            throw new Error("CommandResult is required.");
          }

          switch (result.type) {
            case CommandTypes.UPDATE_BLOCK:
              await updateBlock({
                params: {
                  siteId: site.id,
                  pageId: result.params.pageId,
                  blockId: result.params.blockId,
                  block: result.params.block,
                },
              });
              break;
            case CommandTypes.REMOVE_BLOCK:
              await deleteBlock({
                params: {
                  siteId: site.id,
                  pageId: result.params.pageId,
                  blockId: result.params.blockId,
                },
              });
              break;
            case CommandTypes.ADD_BLOCK:
              await createBlock({
                params: {
                  siteId: site.id,
                  pageId: result.params.pageId,
                  block: result.params.block,
                },
              });
              break;
            case CommandTypes.REORDER_BLOCK:
              await reorderBlock({
                params: {
                  siteId: site.id,
                  pageId: result.params.pageId,
                  sourceId: result.params.sourceBlockId,
                  targetId: result.params.targetBlockId,
                },
              });
              break;
            default:
              break;
          }

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
      },
      {
        loading: "Saving changes...",
        success: "Saved",
        error: "Failed to save",
      }
    )
  );

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    updateDB,
  };
}
