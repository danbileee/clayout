import { SiteBlockSchema, SiteBlockTypes } from "@clayout/interface";
import { TextEditorContent } from "./text";
import { ImageEditorContent } from "./image";
import { ButtonEditorContent } from "./button";
import { useSiteContext } from "@/pages/sites/:id/contexts/site.context";
import { BlockRegistry } from "@clayout/kit";
import { useBlockById } from "@/lib/zustand/editor";
import type { BlockEditorProps } from "../types";
import type { z } from "zod";

export function BlockEditorContent() {
  const { block } = useSiteContext();
  const blockSchema = useBlockById(block?.id.toString() ?? "");

  if (!block || block.type === SiteBlockTypes.None) {
    return null;
  }

  const parsedBlock = SiteBlockSchema.parse(blockSchema);
  const { block: registeredBlock } = new BlockRegistry().find(parsedBlock);
  const restProps: Pick<
    BlockEditorProps<z.infer<typeof SiteBlockSchema>>,
    "createdAt" | "updatedAt"
  > = {
    createdAt: block.createdAt,
    updatedAt: block.updatedAt,
  };

  return (
    <>
      {registeredBlock.type === SiteBlockTypes.Text && (
        <TextEditorContent block={registeredBlock} {...restProps} />
      )}
      {registeredBlock.type === SiteBlockTypes.Image && (
        <ImageEditorContent block={registeredBlock} {...restProps} />
      )}
      {registeredBlock.type === SiteBlockTypes.Button && (
        <ButtonEditorContent block={registeredBlock} {...restProps} />
      )}
    </>
  );
}
