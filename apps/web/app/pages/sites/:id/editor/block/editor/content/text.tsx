import type { z } from "zod";
import { SiteBlockTypes, TextBlockSchema } from "@clayout/interface";
import { useHandleChangeBlock } from "@/pages/sites/:id/editor/hooks/useHandleChangeBlock";
import * as Typo from "@/components/ui/typography";
import { Icon } from "@/components/ui/icon";
import { IconNote } from "@tabler/icons-react";
import { Textarea } from "@/components/ui/textarea";
import type { BlockEditorProps } from "../types";
import * as Editor from "@/pages/sites/:id/editor/styled/editor";

export function TextEditorContent({
  block,
}: BlockEditorProps<z.infer<typeof TextBlockSchema>>) {
  const { handleChangeData } = useHandleChangeBlock({
    block: {
      type: SiteBlockTypes.Text,
      id: block.id,
    },
  });

  if (!block.id) return null;

  return (
    <Editor.List>
      <Editor.Item>
        <Editor.Header>
          <Typo.P size="sm" flex>
            <Icon>{IconNote}</Icon>
            <span>Content</span>
          </Typo.P>
        </Editor.Header>
        <Textarea
          id={`${block.id.toString()}-content`}
          value={block.data?.value}
          onChange={(e) =>
            handleChangeData({
              value: e.target.value,
            })
          }
        />
      </Editor.Item>
    </Editor.List>
  );
}
