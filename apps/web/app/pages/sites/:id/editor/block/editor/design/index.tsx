import { SiteBlockSchema, SiteBlockTypes } from "@clayout/interface";
import { TextEditorDesign } from "./text";
import { ImageEditorDesign } from "./image";
import { ButtonEditorDesign } from "./button";
import { useSiteContext } from "@/pages/sites/:id/contexts/site.context";
import { BlockRegistry } from "@clayout/kit";

export function BlockEditorDesign() {
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
        <TextEditorDesign block={registeredBlock} {...dates} />
      )}
      {registeredBlock.type === SiteBlockTypes.Image && <ImageEditorDesign />}
      {registeredBlock.type === SiteBlockTypes.Button && <ButtonEditorDesign />}
    </>
  );
}
