import { useSiteContext } from "@/pages/sites/:id/contexts/site.context";
import * as Editor from "@/pages/sites/:id/editor/shared/styled/editor";
import * as BoxModel from "@/pages/sites/:id/editor/shared/box-model";
import * as Background from "@/pages/sites/:id/editor/shared/background";
import { useHandleChangePage } from "@/pages/sites/:id/editor/hooks/useHandleChangePage";
import { SitePageSchema, type PageSchema } from "@clayout/interface";
import { Alignment } from "@/pages/sites/:id/editor/shared/align";
import { ContentFit } from "@/pages/sites/:id/editor/shared/content-fit";
import { usePageById, useUpdatePage } from "@/lib/zustand/editor";

export function PageEditorDesign() {
  const { selectedPageId } = useSiteContext();
  const { handleChangeContainerStyle } = useHandleChangePage();
  const page = usePageById(selectedPageId ?? undefined);
  const updatePageLocally = useUpdatePage();

  if (!page) {
    console.warn("Page not found in the zustand store.");
    return null;
  }

  const handleChange = async (containerStyle: PageSchema["containerStyle"]) => {
    if (!page.id) {
      throw new Error("pageId is required");
    }

    updatePageLocally(page.id, { containerStyle });
    await handleChangeContainerStyle(containerStyle);
  };

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
  } = SitePageSchema.shape.containerStyle.parse(page.containerStyle);

  return (
    <Editor.List>
      <ContentFit value={{ contentFit }} onChange={handleChange} />
      <Alignment value={{ align }} onChange={handleChange} />
      <BoxModel.Root>
        <BoxModel.Padding value={{ padding }} onChange={handleChange} />
        <BoxModel.Border
          value={{
            borderWidth,
            borderColor,
            borderRadius,
            borderStyle,
          }}
          onChange={handleChange}
        />
        <BoxModel.Margin value={{ margin }} onChange={handleChange} />
      </BoxModel.Root>
      <Background.Root>
        <Background.Color value={{ backgroundColor }} onChange={handleChange} />
        <Background.Image
          value={{
            backgroundImage,
            backgroundPosition,
            backgroundRepeat,
            backgroundSize,
          }}
          onChange={handleChange}
        />
      </Background.Root>
    </Editor.List>
  );
}
