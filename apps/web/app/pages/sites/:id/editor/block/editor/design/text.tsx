import type { z } from "zod";
import {
  SiteBlockTypes,
  TextBlockSchema,
  type BlockContainerStyle,
} from "@clayout/interface";
import type { BlockEditorProps } from "../types";
import { Alignment } from "../shared/align";
import { useSiteContext } from "@/pages/sites/:id/contexts/site.context";
import { useUpdateBlock } from "@/lib/zustand/editor";
import { useMutateBlock } from "../hooks/useMutateBlock";
import * as BlockEditor from "../styled";
import * as BoxModel from "../shared/box-model";

export function TextEditorDesign({
  block,
}: BlockEditorProps<z.infer<typeof TextBlockSchema>>) {
  const { site, page } = useSiteContext();
  const updateBlock = useUpdateBlock();
  const mutateBlock = useMutateBlock();

  if (!block.id) return null;

  const {
    align,
    borderWidth,
    borderColor,
    borderRadius,
    borderStyle,
    padding,
    margin,
  } = block.containerStyle ?? {};

  const handleChangeContainerStyle = async (value: BlockContainerStyle) => {
    if (!site?.id || !page?.id || !block.id) {
      throw new Error(`siteId, pageId, and blockId are required.`);
    }

    updateBlock(block.id, SiteBlockTypes.Text, {
      containerStyle: value,
    });

    await mutateBlock.current({
      siteId: site.id,
      pageId: page.id,
      block: {
        id: block.id,
        containerStyle: value,
      },
    });
  };

  return (
    <BlockEditor.List>
      <Alignment value={{ align }} onChange={handleChangeContainerStyle} />
      <BoxModel.Root>
        <BoxModel.Borders
          value={{
            borderWidth,
            borderColor,
            borderRadius,
            borderStyle,
          }}
          onChange={handleChangeContainerStyle}
        />
        <BoxModel.Padding
          value={{ padding }}
          onChange={handleChangeContainerStyle}
        />
        <BoxModel.Margin
          value={{ margin }}
          onChange={handleChangeContainerStyle}
        />
      </BoxModel.Root>
    </BlockEditor.List>
  );
}
