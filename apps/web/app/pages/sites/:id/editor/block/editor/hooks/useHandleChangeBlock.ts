import { useUpdateBlock } from "@/lib/zustand/editor";
import { useSiteContext } from "@/pages/sites/:id/contexts/site.context";
import type {
  BlockContainerStyle,
  BlockDataOf,
  BlockSchemaByType,
  BlockStyleOf,
  UpdateSiteBlockDto,
} from "@clayout/interface";
import { useClientMutation } from "@/lib/react-query/useClientMutation";
import { patchSiteBlocks } from "@/apis/sites/pages/blocks";
import { useRef } from "react";
import debounce from "lodash/debounce";
import { toast } from "sonner";
import { handleError } from "@/lib/axios/handleError";

interface Params<K> {
  block: {
    type: K;
    id?: number;
  };
}

export function useHandleChangeBlock<K extends keyof typeof BlockSchemaByType>({
  block,
}: Params<K>) {
  const { site, selectedPageId } = useSiteContext();
  const { mutateAsync } = useClientMutation({
    mutationFn: patchSiteBlocks,
  });
  const updateBlock = useUpdateBlock();

  const mutateBlock = useRef(
    debounce(
      async (params: {
        siteId: number;
        pageId: number;
        block: UpdateSiteBlockDto & { id: number };
      }) => {
        toast.promise(
          async () => {
            const { siteId, pageId, block } = params;

            const fn = async () => {
              await mutateAsync({
                params: {
                  siteId,
                  pageId,
                  blockId: block.id,
                  block,
                },
              });
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
        );
      },
      1000
    )
  );

  const handleChangeContainerStyle = async (value: BlockContainerStyle) => {
    if (!site?.id || !selectedPageId || !block.id) {
      throw new Error(`siteId, selectedPageId, and blockId are required.`);
    }

    /**
     * real-time UI update (w/ zustand)
     */
    updateBlock(block.id, block.type, {
      containerStyle: value,
    });

    /**
     * debounced DB update (w/ API request)
     */
    await mutateBlock.current({
      siteId: site.id,
      pageId: selectedPageId,
      block: {
        id: block.id,
        containerStyle: value,
      },
    });
  };

  const handleChangeData = async (value: Partial<BlockDataOf<K>>) => {
    if (!site?.id || !selectedPageId || !block.id) {
      throw new Error(`siteId, selectedPageId, and blockId are required.`);
    }

    /**
     * real-time UI update (w/ zustand)
     */
    updateBlock(block.id, block.type, {
      data: value,
    });

    /**
     * debounced DB update (w/ API request)
     */
    await mutateBlock.current({
      siteId: site.id,
      pageId: selectedPageId,
      block: {
        id: block.id,
        data: value,
      },
    });
  };

  const handleChangeStyle = async (value: Partial<BlockStyleOf<K>>) => {
    if (!site?.id || !selectedPageId || !block.id) {
      throw new Error(`siteId, selectedPageId, and blockId are required.`);
    }

    /**
     * real-time UI update (w/ zustand)
     */
    updateBlock(block.id, block.type, {
      style: value,
    });

    /**
     * debounced DB update (w/ API request)
     */
    await mutateBlock.current({
      siteId: site.id,
      pageId: selectedPageId,
      block: {
        id: block.id,
        style: value,
      },
    });
  };

  return {
    handleChangeContainerStyle,
    handleChangeData,
    handleChangeStyle,
  };
}
