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
import throttle from "lodash/throttle";
import { useSiteContext } from "@/pages/sites/:id/contexts/site.context";
import { useRef } from "react";
import { toast } from "sonner";

export function TextEditorContent({
  block,
}: BlockEditorProps<z.infer<typeof TextBlockSchema>>) {
  const { site, page } = useSiteContext();
  const updateBlock = useUpdateBlock();
  const mutateBlock = useMutateBlock();

  const throttledMutation = useRef(
    throttle(async (value: string) => {
      if (!site?.id || !page?.id || !block.id) return;

      toast.promise(
        async () =>
          await mutateBlock({
            siteId: site.id,
            pageId: page.id,
            block: {
              ...block,
              data: {
                ...block.data,
                value,
              },
            },
          }),
        {
          loading: "Saving changes...",
          success: "Saved",
          error: "Failed to save",
        }
      );
    }, 2500)
  );

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    if (!site?.id || !page?.id || !block.id) return;

    const { value } = e.target;

    updateBlock(block.id, SiteBlockTypes.Text, (prev) => ({
      ...prev,
      data: {
        ...prev.data,
        value,
      },
    }));

    throttledMutation.current(value);
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
