import { patchSitePages } from "@/apis/sites/pages";
import { useClientMutation } from "@/lib/react-query/useClientMutation";
import { getError } from "@/lib/zod/getError";
import { SitePageSchema } from "@clayout/interface";
import {
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import { useSiteContext } from "@/pages/sites/:id/contexts/site.context";
import { handleError } from "@/lib/axios/handleError";
import { useUpdatePage } from "@/lib/zustand/editor";

interface Params {
  pageId: ReturnType<typeof useSiteContext>["selectedPageId"];
  initialState?: {
    editing?: boolean;
    inputError?: string;
  };
  onSuccess?: VoidFunction;
  onError?: VoidFunction;
}

export function useEditablePageSlug({
  pageId,
  initialState,
  onSuccess,
  onError,
}: Params) {
  const { site, refetchSite } = useSiteContext();
  const [editing, setEditing] = useState(initialState?.editing ?? false);
  const [inputError, setInputError] = useState<string | undefined>(
    initialState?.inputError ?? undefined
  );
  const { mutateAsync: updatePage } = useClientMutation({
    mutationFn: patchSitePages,
  });
  const updatePageLocally = useUpdatePage();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!pageId) {
      throw new Error("pageId is required.");
    }

    if (inputError) {
      setInputError(undefined);
    }

    updatePageLocally(pageId, { slug: e.target.value });
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
        onError?.();
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
