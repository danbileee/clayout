import { useUpdateBlock } from "@/lib/zustand/editor";
import { useSiteContext } from "@/pages/sites/:id/contexts/site.context";
import { useMutateBlock } from "./useMutateBlock";
import type {
  BlockContainerStyle,
  BlockDataOf,
  BlockSchemaByType,
  BlockStyleOf,
} from "@clayout/interface";

export function useHandleChangeBlock<K extends keyof typeof BlockSchemaByType>(
  type: K,
  blockId?: number
) {
  const { site, page } = useSiteContext();
  const updateBlock = useUpdateBlock();
  const mutateBlock = useMutateBlock();

  const handleChangeContainerStyle = async (value: BlockContainerStyle) => {
    if (!site?.id || !page?.id || !blockId) {
      throw new Error(`siteId, pageId, and blockId are required.`);
    }

    /**
     * real-time UI update (w/ zustand)
     */
    updateBlock(blockId, type, {
      containerStyle: value,
    });

    /**
     * debounced DB update (w/ API request)
     */
    await mutateBlock.current({
      siteId: site.id,
      pageId: page.id,
      block: {
        id: blockId,
        containerStyle: value,
      },
    });
  };

  const handleChangeData = async (value: Partial<BlockDataOf<K>>) => {
    if (!site?.id || !page?.id || !blockId) {
      throw new Error(`siteId, pageId, and blockId are required.`);
    }

    /**
     * real-time UI update (w/ zustand)
     */
    updateBlock(blockId, type, {
      data: value,
    });

    /**
     * debounced DB update (w/ API request)
     */
    await mutateBlock.current({
      siteId: site.id,
      pageId: page.id,
      block: {
        id: blockId,
        data: value,
      },
    });
  };

  const handleChangeStyle = async (value: Partial<BlockStyleOf<K>>) => {
    if (!site?.id || !page?.id || !blockId) {
      throw new Error(`siteId, pageId, and blockId are required.`);
    }

    /**
     * real-time UI update (w/ zustand)
     */
    updateBlock(blockId, type, {
      style: value,
    });

    /**
     * debounced DB update (w/ API request)
     */
    await mutateBlock.current({
      siteId: site.id,
      pageId: page.id,
      block: {
        id: blockId,
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
