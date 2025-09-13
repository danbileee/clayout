import { SiteBlockSchema, SiteBlockTypes } from "@clayout/interface";
import { TextEditorDesign } from "./text";
import { ImageEditorDesign } from "./image";
import { ButtonEditorDesign } from "./button";
import { useSiteContext } from "@/pages/sites/:id/contexts/site.context";
import { BlockRegistry } from "@clayout/kit";
import { useBlockById } from "@/lib/zustand/editor";

export function BlockEditorDesign() {
  const { block } = useSiteContext();
  const blockSchema = useBlockById(block?.id.toString() ?? "");

  if (!block || block.type === SiteBlockTypes.None) {
    return null;
  }

  const parsedBlock = SiteBlockSchema.parse(blockSchema);
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
