import { SiteBlockSchema, SiteBlockTypes } from "@clayout/interface";
import { TextEditorContent } from "./text";
import { ImageEditorContent } from "./image";
import { ButtonEditorContent } from "./button";
import { useSiteContext } from "@/pages/sites/:id/contexts/site.context";
import { BlockRegistry } from "@clayout/kit";

export function BlockEditorContent() {
  const { block } = useSiteContext();

  if (!block || block.type === SiteBlockTypes.None) {
    return null;
  }

  const parsedBlock = SiteBlockSchema.parse(block);
  const { block: registeredBlock } = new BlockRegistry().find(parsedBlock);
  const dates = {
    createdAt: block.createdAt,
    updatedAt: block.updatedAt,
  };

  return (
    <>
      {registeredBlock.type === SiteBlockTypes.Text && (
        <TextEditorContent block={registeredBlock} {...dates} />
      )}
      {registeredBlock.type === SiteBlockTypes.Image && <ImageEditorContent />}
      {registeredBlock.type === SiteBlockTypes.Button && (
        <ButtonEditorContent />
      )}
    </>
  );
}
