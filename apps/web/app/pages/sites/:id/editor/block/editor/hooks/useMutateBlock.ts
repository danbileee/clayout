import { useRef, type RefObject } from "react";
import { patchSiteBlocks } from "@/apis/sites/pages/blocks";
import { handleError } from "@/lib/axios/handleError";
import { useClientMutation } from "@/lib/react-query/useClientMutation";
import type { UpdateSiteBlockDto } from "@clayout/interface";
import type { DebouncedFunc } from "lodash";
import debounce from "lodash/debounce";
import { toast } from "sonner";

interface MutationParams {
  siteId?: number;
  pageId?: number;
  block: UpdateSiteBlockDto & { id: number };
}

type Returns = RefObject<
  DebouncedFunc<(params: MutationParams) => Promise<void>>
>;

export function useMutateBlock(): Returns {
  const { mutateAsync } = useClientMutation({
    mutationFn: patchSiteBlocks,
  });

  return useRef(
    debounce(async (params: MutationParams) => {
      toast.promise(
        async () => {
          const { siteId, pageId, block } = params;

          const fn = async () => {
            if (!siteId || !pageId || !block.id) {
              throw new Error(`siteId, pageId, and blockId are required.`);
            }

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
    }, 1000)
  );
}
