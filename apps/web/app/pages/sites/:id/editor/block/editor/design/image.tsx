import { z } from "zod";
import { SiteBlockTypes, type ImageBlockSchema } from "@clayout/interface";
import { useHandleChangeBlock } from "@/pages/sites/:id/editor/hooks/useHandleChangeBlock";
import * as Editor from "@/pages/sites/:id/editor/styled/editor";
import * as BoxModel from "../shared/box-model";
import * as Background from "../shared/background";
import { Width } from "../shared/width";
import { Alignment } from "../shared/align";
import type { BlockEditorProps } from "../types";

export function ImageEditorDesign({
  block,
}: BlockEditorProps<z.infer<typeof ImageBlockSchema>>) {
  const { handleChangeContainerStyle, handleChangeStyle } =
    useHandleChangeBlock({
      block: {
        type: SiteBlockTypes.Image,
        id: block.id,
      },
    });

  if (!block.id) return null;

  const {
    align,
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
  const { width } = block.style ?? {};

  return (
    <Editor.List>
      <Width value={{ width }} onChange={handleChangeStyle} />
      <Alignment value={{ align }} onChange={handleChangeContainerStyle} />
      <BoxModel.Root>
        <BoxModel.Padding
          value={{ padding }}
          onChange={handleChangeContainerStyle}
        />
        <BoxModel.Border
          value={{
            borderWidth,
            borderColor,
            borderRadius,
            borderStyle,
          }}
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
    </Editor.List>
  );
}
