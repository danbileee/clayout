import type { z } from "zod";
import { SiteBlockTypes, TextBlockSchema } from "@clayout/interface";
import type { BlockEditorProps } from "../types";
import * as BlockEditor from "../styled";
import * as Typo from "@/components/ui/typography";
import { Icon } from "@/components/ui/icon";
import { IconMessage } from "@tabler/icons-react";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateBlock } from "@/lib/zustand/editor";
import { useMutateBlock } from "../hooks/useMutateBlock";
import { useSiteContext } from "@/pages/sites/:id/contexts/site.context";

export function TextEditorContent({
  block,
}: BlockEditorProps<z.infer<typeof TextBlockSchema>>) {
  const { site, page } = useSiteContext();
  const updateBlock = useUpdateBlock();
  const mutateBlock = useMutateBlock();

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = async (
    e
  ) => {
    if (!site?.id || !page?.id || !block.id) {
      throw new Error(`siteId, pageId, and blockId are required.`);
    }

    const { value } = e.target;

    updateBlock(block.id, SiteBlockTypes.Text, {
      data: { value },
    });

    await mutateBlock.current({
      siteId: site.id,
      pageId: page.id,
      block: {
        id: block.id,
        data: { value },
      },
    });
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
