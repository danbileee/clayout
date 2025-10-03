import * as Editor from "@/pages/sites/:id/editor/shared/styled/editor";
import * as Typo from "@/components/ui/typography";
import * as Tooltip from "@/components/ui/tooltip";
import { Icon } from "@/components/ui/icon";
import { IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useSiteContext } from "@/pages/sites/:id/contexts/site.context";
import { useDialog } from "@/components/ui/dialog";
import { ConfirmDeleteDialog } from "@/components/shared/dialogs/confirm/delete";
import { handleError } from "@/lib/axios/handleError";
import { useClientMutation } from "@/lib/react-query/useClientMutation";
import { deleteSitePages } from "@/apis/sites/pages";

export function DeletePage() {
  const { site, selectedPage, closePageEditor, setPage } = useSiteContext();
  const { openDialog, closeDialog } = useDialog();
  const { mutateAsync: deletePage } = useClientMutation({
    mutationFn: deleteSitePages,
  });

  const submit = async () => {
    const fn = async () => {
      if (!site?.id || !selectedPage?.id) {
        throw new Error("siteId and pageId are required");
      }

      await deletePage({
        params: {
          siteId: site.id,
          pageId: selectedPage.id,
        },
      });

      closePageEditor();

      const homePage = site?.pages?.find((page) => page.isHome);

      if (homePage) {
        setPage(homePage.id);
      }

      closeDialog();
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

  const handleDelete = async () => {
    openDialog(
      <ConfirmDeleteDialog
        title="Delete this page?"
        confirmButtonProps={{
          onClick: submit,
        }}
      />
    );
  };

  return (
    <Editor.Item>
      <Editor.Header>
        <Typo.P size="sm" flex>
          <Icon>{IconTrash}</Icon>
          <span>Delete this page</span>
        </Typo.P>
        {selectedPage?.isHome ? (
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button size="sm" level="destructive" variant="outlined" disabled>
                Delete
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content side="right">{`Home page cannot be deleted.`}</Tooltip.Content>
          </Tooltip.Root>
        ) : (
          <Button
            size="sm"
            level="destructive"
            variant="outlined"
            onClick={handleDelete}
          >
            Delete
          </Button>
        )}
      </Editor.Header>
    </Editor.Item>
  );
}
