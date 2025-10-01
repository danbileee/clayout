import { Icon } from "@/components/ui/icon";
import * as Typo from "@/components/ui/typography";
import * as Editor from "@/pages/sites/:id/editor/styled/editor";
import { IconFileSearch, IconRouter } from "@tabler/icons-react";
import { useSiteContext } from "@/pages/sites/:id/contexts/site.context";
import { useHandleChangePageSlug } from "../../hooks/useHandleChangePageSlug";
import { TextInput } from "@/components/ui/input";
import { VFlexBox } from "@/components/ui/box";
import { HelpButton } from "@/components/shared/buttons/help";
import { useTheme } from "styled-components";
import { toast } from "sonner";

export function PageEditorContent() {
  const theme = useTheme();
  const { selectedPage } = useSiteContext();
  const { inputError, handleChange, handleBlur, handleKeyDown } =
    useHandleChangePageSlug({
      pageId: selectedPage?.id ?? null,
      initialState: { editing: true },
      onSuccess: () => toast.success("Saved"),
      onError: () => toast.error("Failed to save"),
    });

  if (!selectedPage) {
    return null;
  }

  return (
    <Editor.List>
      <Editor.Item>
        <Editor.Header>
          <Typo.P size="sm" flex>
            <Icon>{IconRouter}</Icon>
            <span>Page path</span>
          </Typo.P>
          <HelpButton>{`Your published page will be available at:\nhttps://[domain]/[page-path]`}</HelpButton>
        </Editor.Header>
        <VFlexBox gap={6}>
          <TextInput
            defaultValue={selectedPage.slug}
            placeholder="Enter page slug..."
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
          />
          {inputError && (
            <Typo.P
              size="xs"
              color={theme.colors.slate[400]}
              style={{ marginTop: 4 }}
            >
              {inputError}
            </Typo.P>
          )}
        </VFlexBox>
      </Editor.Item>
      <Editor.Item>
        <Editor.Header>
          <Typo.P size="sm" flex>
            <Icon>{IconFileSearch}</Icon>
            <span>Meta info</span>
          </Typo.P>
        </Editor.Header>
        <VFlexBox gap={16}>
          <VFlexBox gap={8}>
            <Editor.Header>
              <Typo.P size="sm" color={theme.colors.slate[600]} flex>
                Title
              </Typo.P>
              <HelpButton>{`Tips:\n· Include your brand name\n· Include target keywords users are likely to search\n· Keep it between 40-60 characters`}</HelpButton>
            </Editor.Header>
          </VFlexBox>
        </VFlexBox>
      </Editor.Item>
    </Editor.List>
  );
}
