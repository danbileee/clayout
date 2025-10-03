import { z } from "zod";
import { SiteBlockTypes, ImageBlockSchema } from "@clayout/interface";
import { useHandleChangeBlock } from "@/pages/sites/:id/editor/hooks/useHandleChangeBlock";
import * as Typo from "@/components/ui/typography";
import { IconAlt, IconPhoto } from "@tabler/icons-react";
import { Icon } from "@/components/ui/icon";
import { TextInput } from "@/components/ui/input";
import type { BlockEditorProps } from "../types";
import * as Editor from "@/pages/sites/:id/editor/shared/styled/editor";
import { ImageManager } from "@/pages/sites/:id/editor/shared/image-manager";
import { HelpButton } from "@/components/shared/buttons/help";
import { useTheme } from "styled-components";
import { VFlexBox } from "@/components/ui/box";
import { getErrors } from "@/lib/zod/getErrors";
import { Link } from "@/pages/sites/:id/editor/shared/link";

/**
 * This schema is locally defined
 * because the schema from `@clayout/interface` package is for the API request
 * This is intended to not block user's input every time onChange
 */
const schema = z.object({
  link: z.string().url().optional(),
  alt: z.string().max(50).optional(),
});

export function ImageEditorContent({
  block,
}: BlockEditorProps<z.infer<typeof ImageBlockSchema>>) {
  const theme = useTheme();
  const { handleChangeData } = useHandleChangeBlock({
    block: {
      type: SiteBlockTypes.Image,
      id: block.id,
    },
  });
  const validation = schema.safeParse(block.data);
  const { link: linkError, alt: altError } = getErrors(validation);

  if (!block.id) return null;

  return (
    <Editor.List>
      <Editor.Item>
        <Editor.Header>
          <Typo.P size="sm" flex>
            <Icon>{IconPhoto}</Icon>
            <span>Source</span>
          </Typo.P>
        </Editor.Header>
        <ImageManager
          value={block.data?.url ?? ""}
          onChange={(v) =>
            handleChangeData({
              url: v,
            })
          }
        />
      </Editor.Item>
      <Link
        id={`${block.id}-link`}
        value={{ link: block.data?.link }}
        error={block.data?.link ? linkError : undefined}
        onChange={handleChangeData}
      />
      <Editor.Item>
        <Editor.Header>
          <Typo.P size="sm" flex>
            <Icon>{IconAlt}</Icon>
            <span>Alt text</span>
          </Typo.P>
          <HelpButton>{`Displayed when the image is unavailable.`}</HelpButton>
        </Editor.Header>
        <VFlexBox gap={6}>
          <TextInput
            id={`${block.id.toString()}-alt`}
            value={block.data?.alt}
            onChange={(e) =>
              handleChangeData({
                alt: e.target.value,
              })
            }
            placeholder="Enter the alt text"
          />
          {block.data?.link && altError && (
            <Typo.P
              size="xs"
              color={theme.colors.slate[400]}
              style={{ marginTop: 4 }}
            >
              {altError}
            </Typo.P>
          )}
        </VFlexBox>
      </Editor.Item>
    </Editor.List>
  );
}
