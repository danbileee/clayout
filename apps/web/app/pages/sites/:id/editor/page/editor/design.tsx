import { useSiteContext } from "@/pages/sites/:id/contexts/site.context";
import * as Editor from "@/pages/sites/:id/editor/shared/styled/editor";
import * as BoxModel from "@/pages/sites/:id/editor/shared/box-model";
import * as Background from "@/pages/sites/:id/editor/shared/background";
import { useHandleChangePage } from "@/pages/sites/:id/editor/hooks/useHandleChangePage";
import { SitePageSchema } from "@clayout/interface";
import { Alignment } from "@/pages/sites/:id/editor/shared/align";
import { ContentFit } from "@/pages/sites/:id/editor/shared/content-fit";

export function PageEditorDesign() {
  const { selectedPage } = useSiteContext();
  const { handleChangeContainerStyle } = useHandleChangePage();

  if (!selectedPage) {
    console.warn(
      "No selected page in this context. This is not an expected situation."
    );
    return null;
  }

  const {
    contentFit = "sm",
    padding,
    margin,
    align = "center",
    borderWidth,
    borderColor,
    borderRadius,
    borderStyle,
    backgroundColor,
    backgroundPosition,
    backgroundImage,
    backgroundRepeat,
    backgroundSize,
  } = SitePageSchema.shape.containerStyle.parse(selectedPage.containerStyle);

  return (
    <Editor.List>
      <ContentFit
        value={{ contentFit }}
        onChange={handleChangeContainerStyle}
      />
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
