import * as Editor from "@/pages/sites/:id/editor/shared/styled/editor";
import { useSiteContext } from "@/pages/sites/:id/contexts/site.context";
import { Slug } from "./slug";
import { Meta } from "./meta";
import { Visibility } from "./visibility";
import { DeletePage } from "./delete";
import { usePageById } from "@/lib/zustand/editor";

export function PageEditorContent() {
  const { selectedPageId } = useSiteContext();
  const page = usePageById(selectedPageId ?? undefined);

  if (!page) {
    console.warn("Page not found in the zustand store.");
    return null;
  }

  return (
    <Editor.List>
      <Slug page={page} />
      <Meta page={page} />
      <Visibility page={page} />
      <DeletePage page={page} />
    </Editor.List>
  );
}
