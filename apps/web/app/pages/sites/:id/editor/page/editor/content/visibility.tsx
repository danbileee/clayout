import * as Editor from "@/pages/sites/:id/editor/shared/styled/editor";
import * as Typo from "@/components/ui/typography";
import * as Tooltip from "@/components/ui/tooltip";
import { Icon } from "@/components/ui/icon";
import { IconEye, IconHome } from "@tabler/icons-react";
import { useSiteContext } from "@/pages/sites/:id/contexts/site.context";
import { SelectHomeDialog } from "@/pages/sites/:id/editor/dialogs/select-home";
import { useHandleChangePage } from "@/pages/sites/:id/editor/hooks/useHandleChangePage";
import { Switch } from "@/components/ui/switch";
import { useDialog } from "@/components/ui/dialog";
import { useClientMutation } from "@/lib/react-query/useClientMutation";
import { patchSitePagesHome } from "@/apis/sites/pages/home";
import { toast } from "sonner";
import { handleError } from "@/lib/axios/handleError";
import type { PageSchema } from "@clayout/interface";
import { useUpdatePage } from "@/lib/zustand/editor";

interface Props {
  page: PageSchema;
}

export function Visibility({ page }: Props) {
  const { openDialog, closeDialog } = useDialog();
  const { site, refetchSite } = useSiteContext();
  const { mutateAsync: updateHomePage } = useClientMutation({
    mutationFn: patchSitePagesHome,
  });
  const { handleChangeData } = useHandleChangePage();
  const updatePageLocally = useUpdatePage();

  const disableHome = async () => {
    const submit = async (newId: number) => {
      const fn = async () => {
        if (!site?.id || !page.id) {
          throw new Error(`siteId and pageId are required.`);
        }

        updatePageLocally(page.id, { isHome: false });

        await updateHomePage({
          params: {
            siteId: site.id,
            pageId: page.id,
            newPageId: newId,
          },
        });
        await refetchSite();

        updatePageLocally(newId, { isHome: true });
        closeDialog();
      };

      try {
        toast.promise(async () => await fn(), {
          loading: "Saving changes...",
          success: "Saved",
          error: "Failed to save",
        });
      } catch (e) {
        const { error } = await handleError(e, {
          onRetry: fn,
        });

        if (error) {
          updatePageLocally(page.id!, { isHome: true });
          updatePageLocally(newId, { isHome: false });
          throw error;
        }
      }
    };

    openDialog(
      <SelectHomeDialog
        pages={site?.pages?.filter((p) => p.id !== page.id) ?? []}
        onSubmit={submit}
      />
    );
  };

  const enableHome = async () => {
    const prevHomePage = site?.pages?.find((page) => page.isHome);

    if (!prevHomePage) {
      throw new Error("prevHomePage is required.");
    }

    const fn = async () => {
      if (!site?.id || !page.id) {
        throw new Error(`siteId and pageId are required.`);
      }

      updatePageLocally(page.id, { isHome: true });

      await updateHomePage({
        params: {
          siteId: site.id,
          pageId: prevHomePage.id,
          newPageId: page.id,
        },
      });

      updatePageLocally(prevHomePage.id, { isHome: false });

      await refetchSite();
    };

    try {
      toast.promise(async () => await fn(), {
        loading: "Saving changes...",
        success: "Saved",
        error: "Failed to save",
      });
    } catch (e) {
      const { error } = await handleError(e, {
        onRetry: fn,
      });

      if (error) {
        updatePageLocally(page.id!, { isHome: false });
        updatePageLocally(prevHomePage.id, { isHome: true });
        throw error;
      }
    }
  };

  const handleChangeIsHome = async () => {
    if (page.isHome) {
      disableHome();
    } else {
      enableHome();
    }
  };

  const handleChangeIsVisible = async (newValue: boolean) => {
    if (!page.id) {
      throw new Error(`pageId is required.`);
    }

    updatePageLocally(page.id, { isVisible: newValue });

    try {
      toast.promise(
        async () =>
          await handleChangeData({
            isVisible: newValue,
          }),
        {
          loading: "Saving changes...",
          success: "Saved",
          error: "Failed to save",
        }
      );
    } catch (e) {
      const { error } = await handleError(e);

      if (error) {
        updatePageLocally(page.id, { isVisible: !newValue });
        throw error;
      }
    }
  };

  return (
    <>
      <Editor.Item>
        <Editor.Header>
          <Typo.P size="sm" flex>
            <Icon>{IconHome}</Icon>
            <span>Set as homepage</span>
          </Typo.P>
          {page.isVisible ? (
            <Tooltip.Root>
              <Tooltip.Trigger>
                <span>
                  <Switch checked={page.isHome} onClick={handleChangeIsHome} />
                </span>
              </Tooltip.Trigger>
              <Tooltip.Content side="right">{`Home page will be shown\nwhen visitors go to your domain\n(e.g. yoursite.com)`}</Tooltip.Content>
            </Tooltip.Root>
          ) : (
            <Tooltip.Root>
              <Tooltip.Trigger>
                <span>
                  <Switch
                    checked={page.isHome}
                    disabled
                    style={{ cursor: "not-allowed" }}
                  />
                </span>
              </Tooltip.Trigger>
              <Tooltip.Content side="right">{`Only visible pages can be set as home.`}</Tooltip.Content>
            </Tooltip.Root>
          )}
        </Editor.Header>
      </Editor.Item>
      <Editor.Item>
        <Editor.Header>
          <Typo.P size="sm" flex>
            <Icon>{IconEye}</Icon>
            <span>Visibility</span>
          </Typo.P>
          {page.isHome ? (
            <Tooltip.Root>
              <Tooltip.Trigger>
                <span>
                  <Switch
                    checked={page.isVisible}
                    disabled
                    style={{ cursor: "not-allowed" }}
                  />
                </span>
              </Tooltip.Trigger>
              <Tooltip.Content side="right">
                {`Home page must be visible.`}
              </Tooltip.Content>
            </Tooltip.Root>
          ) : (
            <Tooltip.Root>
              <Tooltip.Trigger>
                <span>
                  <Switch
                    checked={page.isVisible}
                    onCheckedChange={handleChangeIsVisible}
                  />
                </span>
              </Tooltip.Trigger>
              <Tooltip.Content side="right">
                {`This page won't be included in the published site\nif visibility is disabled.`}
              </Tooltip.Content>
            </Tooltip.Root>
          )}
        </Editor.Header>
      </Editor.Item>
    </>
  );
}
