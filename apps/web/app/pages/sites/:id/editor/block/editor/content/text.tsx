import type { z } from "zod";
import { SiteBlockTypes, TextBlockSchema } from "@clayout/interface";
import type { BlockEditorProps } from "../types";
import * as BlockEditor from "../styled";
import * as Typo from "@/components/ui/typography";
import { Icon } from "@/components/ui/icon";
import { IconMessage } from "@tabler/icons-react";
import { Textarea } from "@/components/ui/textarea";
import { useHandleChangeBlock } from "../hooks/useHandleChangeBlock";

export function TextEditorContent({
  block,
}: BlockEditorProps<z.infer<typeof TextBlockSchema>>) {
  const { handleChangeData } = useHandleChangeBlock(
    SiteBlockTypes.Text,
    block.id
  );

  if (!block.id) return null;

  return (
    <BlockEditor.List>
      <BlockEditor.Item>
        <BlockEditor.Header>
          <Typo.P size="sm" flex>
            <Icon>{IconMessage}</Icon>
            <span>Content</span>
          </Typo.P>
        </BlockEditor.Header>
        <Textarea
          id={`${block.id.toString()}-content`}
          value={block.data?.value}
          onChange={(e) =>
            handleChangeData({
              value: e.target.value,
            })
          }
        />
      </BlockEditor.Item>
    </BlockEditor.List>
  );
}
