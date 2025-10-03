import * as Editor from "@/pages/sites/:id/editor/shared/styled/editor";
import * as Typo from "@/components/ui/typography";
import { Icon } from "@/components/ui/icon";
import { IconFileSearch } from "@tabler/icons-react";
import { HelpButton } from "@/components/shared/buttons/help";
import { VFlexBox } from "@/components/ui/box";
import { TextInput } from "@/components/ui/input";
import { useState, type ChangeEvent } from "react";
import { useHandleChangePage } from "@/pages/sites/:id/editor/hooks/useHandleChangePage";
import { ImageManager } from "@/pages/sites/:id/editor/shared/image-manager";
import {
  SitePageMetaSchema,
  SitePageSchema,
  type PageSchema,
} from "@clayout/interface";
import { getError } from "@/lib/zod/getError";
import { useTheme } from "styled-components";
import { rem } from "@/utils/rem";
import { useUpdatePage } from "@/lib/zustand/editor";

interface MetaError {
  name?: string;
  description?: string;
}

interface Props {
  page: PageSchema;
}

export function Meta({ page }: Props) {
  const theme = useTheme();
  const { handleChangeData } = useHandleChangePage();
  const [errors, setErrors] = useState<MetaError>({});
  const updatePageLocally = useUpdatePage();

  const handleChangeName = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!page.id) {
      throw new Error("pageId is required");
    }

    const newValue = e.target.value;

    updatePageLocally(page.id, { name: newValue });

    const validation = SitePageSchema.shape.name.safeParse(newValue);
    const error = getError(validation);

    if (error) {
      setErrors((prev) => ({
        ...prev,
        name: error,
      }));
      return;
    }

    await handleChangeData({
      name: newValue,
    });

    setErrors(({ name, ...prev }) => prev);
  };

  const handleChangeDescription = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!page.id) {
      throw new Error("pageId is required");
    }

    const newValue = e.target.value;

    updatePageLocally(page.id, {
      meta: {
        description: newValue,
      },
    });

    const validation = SitePageMetaSchema.shape.description.safeParse(newValue);
    const error = getError(validation);

    if (error) {
      setErrors((prev) => ({
        ...prev,
        description: error,
      }));
      return;
    }

    await handleChangeData({
      meta: {
        description: newValue,
      },
    });

    setErrors(({ description, ...prev }) => prev);
  };

  return (
    <Editor.Item>
      <Editor.Header>
        <Typo.P size="sm" flex>
          <Icon>{IconFileSearch}</Icon>
          <span>Meta info</span>
        </Typo.P>
      </Editor.Header>
      <VFlexBox gap={8}>
        <VFlexBox>
          <Editor.Header style={{ marginBottom: rem(4) }}>
            <Typo.P
              size="sm"
              color={theme.colors.slate[500]}
              style={{ paddingLeft: rem(4) }}
              flex
            >
              Title
            </Typo.P>
            <HelpButton>{`Tips:\n· Include your brand name\n· Include target keywords users are likely to search\n· Keep it between 40-60 characters`}</HelpButton>
          </Editor.Header>
          <VFlexBox gap={6}>
            <TextInput
              defaultValue={page.name}
              placeholder="Enter page name..."
              onChange={handleChangeName}
              hasError={Boolean(errors.name)}
            />
            {errors.name && (
              <Typo.P
                size="xs"
                color={theme.colors.slate[400]}
                style={{ marginTop: 4 }}
              >
                {errors.name}
              </Typo.P>
            )}
          </VFlexBox>
        </VFlexBox>
        <VFlexBox>
          <Editor.Header style={{ marginBottom: rem(4) }}>
            <Typo.P
              size="sm"
              color={theme.colors.slate[500]}
              style={{ paddingLeft: rem(4) }}
              flex
            >
              Description
            </Typo.P>
            <HelpButton>{`Tips:\n· Keep it between 80-150 characters\n· Clearly explain the value of the page\n· Add a light call to action ("Try it now", "Get started")`}</HelpButton>
          </Editor.Header>
          <VFlexBox gap={6}>
            <TextInput
              defaultValue={page.meta?.description}
              placeholder="Enter page description..."
              onChange={handleChangeDescription}
              hasError={Boolean(errors.description)}
            />
            {errors.description && (
              <Typo.P
                size="xs"
                color={theme.colors.slate[400]}
                style={{ marginTop: 4 }}
              >
                {errors.description}
              </Typo.P>
            )}
          </VFlexBox>
        </VFlexBox>
        <VFlexBox>
          <Editor.Header style={{ marginBottom: rem(4) }}>
            <Typo.P
              size="sm"
              color={theme.colors.slate[500]}
              style={{ paddingLeft: rem(4) }}
              flex
            >
              Open Graph Image
            </Typo.P>
            <HelpButton>{`Tips:\n· Recommended size: 1200x630px (landscape)\n· Supported formats: .jpg, .png, .webp\n· Keep file size under 1MB\n· Design something clean, readable, and brand-aligned`}</HelpButton>
          </Editor.Header>
          <ImageManager
            value={page.meta?.ogImagePath ?? ""}
            onChange={(v) =>
              handleChangeData({
                meta: {
                  ogImagePath: v,
                },
              })
            }
          />
        </VFlexBox>
      </VFlexBox>
    </Editor.Item>
  );
}
