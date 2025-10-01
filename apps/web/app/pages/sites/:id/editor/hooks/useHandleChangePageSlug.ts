import { patchSitePages } from "@/apis/sites/pages";
import { useClientMutation } from "@/lib/react-query/useClientMutation";
import { getError } from "@/lib/zod/getError";
import { SitePageSchema } from "@clayout/interface";
import { useState, type FocusEvent, type KeyboardEvent } from "react";
import { useSiteContext } from "@/pages/sites/:id/contexts/site.context";
import { handleError } from "@/lib/axios/handleError";

interface Params {
  pageId: ReturnType<typeof useSiteContext>["selectedPageId"];
  onSuccess?: VoidFunction;
}

export function useHandleChangePageSlug({ pageId, onSuccess }: Params) {
  const { site, refetchSite } = useSiteContext();
  const [editing, setEditing] = useState(false);
  const [inputError, setInputError] = useState<string | undefined>(undefined);
  const { mutateAsync: updatePage } = useClientMutation({
    mutationFn: patchSitePages,
  });

  const handleChange = () => {
    if (inputError) {
      setInputError(undefined);
    }
  };

  const updatePageSlug = async (newValue: string) => {
    const validation = SitePageSchema.shape.slug.safeParse(newValue);
    const error = getError(validation);

    if (error) {
      setInputError(error);
      return;
    }

    const fn = async () => {
      if (!site?.id || !pageId) {
        throw new Error("siteId and pageId are required.");
      }

      await updatePage({
        params: {
          siteId: site.id,
          pageId,
          slug: newValue,
        },
      });
      await refetchSite();

      setEditing(false);
      setInputError(undefined);
      onSuccess?.();
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

  const handleBlur = async (e: FocusEvent<HTMLInputElement>) => {
    if (inputError) {
      setEditing(false);
      setInputError(undefined);
      return;
    }

    updatePageSlug(e.currentTarget.value.trim());
  };

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Escape") {
      if (inputError) {
        setEditing(false);
        setInputError(undefined);
        return;
      }

      updatePageSlug(e.currentTarget.value.trim());
    }
  };

  return {
    editing,
    inputError,
    setEditing,
    setInputError,
    handleChange,
    handleBlur,
    handleKeyDown,
  };
}
