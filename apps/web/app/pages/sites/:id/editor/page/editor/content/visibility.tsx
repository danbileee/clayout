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
import { useState } from "react";
import { handleError } from "@/lib/axios/handleError";

export function Visibility() {
  const { openDialog, closeDialog } = useDialog();
  const { site, selectedPage, refetchSite } = useSiteContext();
  const { mutateAsync: updateHomePage } = useClientMutation({
    mutationFn: patchSitePagesHome,
  });
  const { handleChangeData } = useHandleChangePage();
  const [isHome, setIsHome] = useState(Boolean(selectedPage?.isHome));
  const [isVisible, setIsVisible] = useState(Boolean(selectedPage?.isVisible));

  const disableHome = async () => {
    if (!site?.id || !selectedPage?.id) return;

    const submit = async (newId: number) => {
      const fn = async () => {
        await updateHomePage({
          params: {
            siteId: site.id,
            pageId: selectedPage.id,
            newPageId: newId,
          },
        });
        await refetchSite();
        closeDialog();
      };

      try {
        toast.promise(async () => await fn(), {
          loading: "Saving changes...",
          success: "Saved",
          error: "Failed to save",
        });
        setIsHome(false);
      } catch (e) {
        const { error } = await handleError(e, {
          onRetry: fn,
        });

        if (error) {
          throw error;
        }
      }
    };

    openDialog(
      <SelectHomeDialog
        pages={site?.pages?.filter((p) => p.id !== selectedPage.id) ?? []}
        onSubmit={submit}
      />
    );
  };

  const enableHome = async () => {
    if (!site?.id || !selectedPage?.id) return;

    setIsHome(true);

    const prevHomePage = site?.pages?.find((page) => page.isHome);

    const fn = async () => {
      if (!prevHomePage) return;

      await updateHomePage({
        params: {
          siteId: site.id,
          pageId: prevHomePage.id,
          newPageId: selectedPage.id,
        },
      });
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
        setIsHome(false);
        throw error;
      }
    }
  };

  const handleChangeIsHome = async () => {
    if (isHome) {
      disableHome();
    } else {
      enableHome();
    }
  };

  const handleChangeIsVisible = async (newValue: boolean) => {
    setIsVisible(newValue);

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
        setIsVisible(!newValue);
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
          {isVisible ? (
            <Tooltip.Root>
              <Tooltip.Trigger>
                <span>
                  <Switch checked={isHome} onClick={handleChangeIsHome} />
                </span>
              </Tooltip.Trigger>
              <Tooltip.Content side="right">{`Home page will be shown\nwhen visitors go to your domain\n(e.g. yoursite.com)`}</Tooltip.Content>
            </Tooltip.Root>
          ) : (
            <Tooltip.Root>
              <Tooltip.Trigger>
                <span>
                  <Switch
                    checked={isHome}
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
          {isHome ? (
            <Tooltip.Root>
              <Tooltip.Trigger>
                <span>
                  <Switch
                    checked={isVisible}
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
                    checked={isVisible}
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
