import { useSiteContext } from "@/pages/sites/:id/contexts/site.context";
import type { UpdateSitePageDto } from "@clayout/interface";
import { useClientMutation } from "@/lib/react-query/useClientMutation";
import { useCallback } from "react";
import { toast } from "sonner";
import { handleError } from "@/lib/axios/handleError";
import { patchSitePages } from "@/apis/sites/pages";

export function useHandleChangePage() {
  const { site, selectedPageId } = useSiteContext();
  const { mutateAsync } = useClientMutation({
    mutationFn: patchSitePages,
  });

  const updateDB = useCallback(
    async (params: { siteId: number; page: UpdateSitePageDto }) => {
      toast.promise(
        async () => {
          const { siteId, page } = params;

          const fn = async () => {
            if (!page.id) {
              throw new Error("pageId is required.");
            }

            await mutateAsync({
              params: {
                siteId,
                pageId: page.id,
                ...page,
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
    [mutateAsync]
  );

  const handleChangeData = async (
    value: Partial<
      Pick<
        UpdateSitePageDto,
        "isHome" | "isVisible" | "meta" | "slug" | "name" | "order"
      >
    >
  ) => {
    if (!site?.id || !selectedPageId) {
      throw new Error(`siteId and selectedPageId are required.`);
    }

    await updateDB({
      siteId: site.id,
      page: {
        id: selectedPageId,
        ...value,
      },
    });
  };

  const handleChangeContainerStyle = async ({
    containerStyle,
  }: NonNullable<Pick<UpdateSitePageDto, "containerStyle">>) => {
    if (!site?.id || !selectedPageId) {
      throw new Error(`siteId and selectedPageId are required.`);
    }

    await updateDB({
      siteId: site.id,
      page: {
        id: selectedPageId,
        containerStyle,
      },
    });
  };

  return {
    handleChangeData,
    handleChangeContainerStyle,
  };
}
