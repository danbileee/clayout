import { z } from "zod";
import { useTheme } from "styled-components";
import { getErrors } from "@/lib/zod/getErrors";
import { SiteBlockTypes, type ButtonBlockSchema } from "@clayout/interface";
import { useHandleChangeBlock } from "@/pages/sites/:id/editor/hooks/useHandleChangeBlock";
import { Icon } from "@/components/ui/icon";
import { IconTxt } from "@tabler/icons-react";
import { VFlexBox } from "@/components/ui/box";
import { TextInput } from "@/components/ui/input";
import * as Typo from "@/components/ui/typography";
import * as Editor from "@/pages/sites/:id/editor/shared/styled/editor";
import type { BlockEditorProps } from "../types";
import { Link } from "@/pages/sites/:id/editor/shared/link";

/**
 * This schema is locally defined
 * because the schema from `@clayout/interface` package is for the API request
 * This is intended to not block user's input every time onChange
 */
const schema = z.object({
  link: z.string().url().optional(),
  text: z.string().max(50).optional(),
});

export function ButtonEditorContent({
  block,
}: BlockEditorProps<z.infer<typeof ButtonBlockSchema>>) {
  const theme = useTheme();
  const { handleChangeData } = useHandleChangeBlock({
    block: {
      type: SiteBlockTypes.Button,
      id: block.id,
    },
  });
  const validation = schema.safeParse(block.data);
  const { link: linkError, text: textError } = getErrors(validation);

  if (!block.id) return null;

  return (
    <Editor.List>
      <Editor.Item>
        <Editor.Header>
          <Typo.P size="sm" flex>
            <Icon>{IconTxt}</Icon>
            <span>Button text</span>
          </Typo.P>
        </Editor.Header>
        <VFlexBox gap={6}>
          <TextInput
            id={`${block.id.toString()}-text`}
            value={block.data?.text}
            onChange={(e) =>
              handleChangeData({
                text: e.target.value,
              })
            }
            placeholder="Enter the button text"
          />
          {block.data?.text && textError && (
            <Typo.P
              size="xs"
              color={theme.colors.slate[400]}
              style={{ marginTop: 4 }}
            >
              {textError}
            </Typo.P>
          )}
        </VFlexBox>
      </Editor.Item>
      <Link
        id={`${block.id}-link`}
        value={{ link: block.data?.link }}
        error={block.data?.link ? linkError : undefined}
        onChange={handleChangeData}
      />
    </Editor.List>
  );
}
