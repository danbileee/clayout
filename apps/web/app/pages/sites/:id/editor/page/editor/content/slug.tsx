import * as Editor from "@/pages/sites/:id/editor/shared/styled/editor";
import * as Typo from "@/components/ui/typography";
import { Icon } from "@/components/ui/icon";
import { IconRouter } from "@tabler/icons-react";
import { HelpButton } from "@/components/shared/buttons/help";
import { VFlexBox } from "@/components/ui/box";
import { TextInput } from "@/components/ui/input";
import { useState, type ChangeEvent } from "react";
import { useHandleChangePage } from "@/pages/sites/:id/editor/hooks/useHandleChangePage";
import { SitePageSchema, type PageSchema } from "@clayout/interface";
import { getError } from "@/lib/zod/getError";
import { useTheme } from "styled-components";
import { useUpdatePage } from "@/lib/zustand/editor";

interface Props {
  page: PageSchema;
}

export function Slug({ page }: Props) {
  const theme = useTheme();
  const { handleChangeData } = useHandleChangePage();
  const [error, setError] = useState<string | undefined>(undefined);
  const updatePageLocally = useUpdatePage();

  const handleChangeSlug = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!page.id) {
      throw new Error("pageId is required");
    }

    const newValue = e.target.value;

    updatePageLocally(page.id, { slug: newValue });

    const validation = SitePageSchema.shape.slug.safeParse(newValue);
    const error = getError(validation);

    if (error) {
      setError(error);
      return;
    }

    await handleChangeData({
      slug: newValue,
    });

    setError(undefined);
  };

  return (
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
          defaultValue={page.slug}
          placeholder="Enter page slug..."
          onChange={handleChangeSlug}
          hasError={Boolean(error)}
        />
        {error && (
          <Typo.P
            size="xs"
            color={theme.colors.slate[400]}
            style={{ marginTop: 4 }}
          >
            {error}
          </Typo.P>
        )}
      </VFlexBox>
    </Editor.Item>
  );
}
