import type { z } from "zod";
import { SiteBlockTypes, TextBlockSchema } from "@clayout/interface";
import type { BlockEditorProps } from "../types";
import * as BlockEditor from "../styled";
import * as Typo from "@/components/ui/typography";
import { Icon } from "@/components/ui/icon";
import { IconMessage } from "@tabler/icons-react";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateBlock } from "@/lib/zustand/editor";

export function TextEditorContent({
  block,
}: BlockEditorProps<z.infer<typeof TextBlockSchema>>) {
  const updateBlock = useUpdateBlock();

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    if (!block.id) return;

    updateBlock(block.id, SiteBlockTypes.Text, (prev) => ({
      ...prev,
      data: {
        ...prev.data,
        value: e.target.value,
      },
    }));
  };

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
          id={block.id.toString()}
          value={block.data?.value}
          onChange={handleChange}
        />
      </BlockEditor.Item>
    </BlockEditor.List>
  );
}
