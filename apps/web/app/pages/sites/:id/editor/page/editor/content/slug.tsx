import * as Editor from "@/pages/sites/:id/editor/shared/styled/editor";
import * as Typo from "@/components/ui/typography";
import { Icon } from "@/components/ui/icon";
import { IconRouter } from "@tabler/icons-react";
import { HelpButton } from "@/components/shared/buttons/help";
import { VFlexBox } from "@/components/ui/box";
import { TextInput } from "@/components/ui/input";
import { useState, type ChangeEvent } from "react";
import { useSiteContext } from "@/pages/sites/:id/contexts/site.context";
import { useHandleChangePage } from "@/pages/sites/:id/editor/hooks/useHandleChangePage";
import { SitePageSchema } from "@clayout/interface";
import { getError } from "@/lib/zod/getError";
import { useTheme } from "styled-components";

export function Slug() {
  const theme = useTheme();
  const { selectedPage } = useSiteContext();
  const { handleChangeData } = useHandleChangePage();
  const [slug, setSlug] = useState(selectedPage?.slug ?? "");
  const [error, setError] = useState<string | undefined>(undefined);

  const handleChangeSlug = async (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    setSlug(newValue);

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
          defaultValue={slug}
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
