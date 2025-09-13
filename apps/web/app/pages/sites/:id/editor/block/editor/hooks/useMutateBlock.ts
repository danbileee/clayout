import { patchSiteBlocks } from "@/apis/sites/pages/blocks";
import { handleError } from "@/lib/axios/handleError";
import { useClientMutation } from "@/lib/react-query/useClientMutation";
import type { UpdateSiteBlockDto } from "@clayout/interface";
import { useCallback } from "react";

interface MutationParams {
  siteId: number;
  pageId: number;
  block: UpdateSiteBlockDto;
}

type Returns = (params: MutationParams) => Promise<void>;

export function useMutateBlock(): Returns {
  const { mutateAsync } = useClientMutation({
    mutationFn: patchSiteBlocks,
  });

  return useCallback(
    async (params: MutationParams) => {
      const fn = async () => {
        const { block } = params;
        if (!block?.id) {
          throw new Error(`Block id not found`);
        }

        await mutateAsync({
          params: {
            ...params,
            blockId: block.id,
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
    [mutateAsync]
  );
}
