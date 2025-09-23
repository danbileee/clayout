import type { z } from "zod";
import { SiteBlockTypes, TextBlockSchema } from "@clayout/interface";
import type { BlockEditorProps } from "../types";
import * as BlockEditor from "../styled";
import * as BoxModel from "../shared/box-model";
import * as Background from "../shared/background";
import { useHandleChangeBlock } from "../hooks/useHandleChangeBlock";

export function TextEditorDesign({
  block,
}: BlockEditorProps<z.infer<typeof TextBlockSchema>>) {
  const { handleChangeContainerStyle } = useHandleChangeBlock(
    SiteBlockTypes.Text,
    block.id
  );

  if (!block.id) return null;

  const {
    borderWidth,
    borderColor,
    borderRadius,
    borderStyle,
    padding,
    margin,
    backgroundColor,
    backgroundImage,
    backgroundPosition,
    backgroundRepeat,
    backgroundSize,
  } = block.containerStyle ?? {};

  return (
    <BlockEditor.List>
      <BoxModel.Root>
        <BoxModel.Border
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
      <Background.Root>
        <Background.Color
          value={{ backgroundColor }}
          onChange={handleChangeContainerStyle}
        />
        <Background.Image
          value={{
            backgroundImage,
            backgroundPosition,
            backgroundRepeat,
            backgroundSize,
          }}
          onChange={handleChangeContainerStyle}
        />
      </Background.Root>
    </BlockEditor.List>
  );
}
