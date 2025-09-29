import type { z } from "zod";
import { SiteBlockTypes, type ButtonBlockSchema } from "@clayout/interface";
import { useHandleChangeBlock } from "@/pages/sites/:id/editor/hooks/useHandleChangeBlock";
import * as BoxModel from "../shared/box-model";
import * as Background from "../shared/background";
import * as ButtonStyle from "../shared/button-style";
import { Alignment } from "../shared/align";
import type { BlockEditorProps } from "../types";
import * as BlockEditor from "../styled";
import { Width } from "../shared/width";

export function ButtonEditorDesign({
  block,
}: BlockEditorProps<z.infer<typeof ButtonBlockSchema>>) {
  const { handleChangeContainerStyle, handleChangeStyle } =
    useHandleChangeBlock({
      block: {
        type: SiteBlockTypes.Button,
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
  const {
    width: buttonWidth,
    color: buttonColor,
    backgroundColor: buttonBackgorundColor,
    fontWeight: buttonFontWeight,
    fontSize: buttonFontSize,
    borderWidth: buttonBorderWidth,
    borderColor: buttonBorderColor,
    borderRadius: buttonBorderRadius,
    borderStyle: buttonBorderStyle,
    padding: buttonPadding,
    textDecoration: buttonTextDecoration,
    textAlign: buttonTextAlign,
  } = block.style ?? {};

  return (
    <BlockEditor.List>
      <Width value={{ width: buttonWidth }} onChange={handleChangeStyle} />
      <ButtonStyle.Root>
        <ButtonStyle.Color
          value={{ color: buttonColor, backgroundColor: buttonBackgorundColor }}
          onChange={handleChangeStyle}
        />
        <ButtonStyle.Font
          value={{
            fontSize: buttonFontSize,
            fontWeight: buttonFontWeight,
            textDecoration: buttonTextDecoration,
            textAlign: buttonTextAlign,
          }}
          onChange={handleChangeStyle}
        />
        <ButtonStyle.Padding
          value={{ padding: buttonPadding }}
          onChange={handleChangeStyle}
        />
        <ButtonStyle.Border
          value={{
            borderWidth: buttonBorderWidth,
            borderColor: buttonBorderColor,
            borderRadius: buttonBorderRadius,
            borderStyle: buttonBorderStyle,
          }}
          onChange={handleChangeStyle}
        />
      </ButtonStyle.Root>
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
    </BlockEditor.List>
  );
}
