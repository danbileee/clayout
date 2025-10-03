import * as Editor from "@/pages/sites/:id/editor/shared/styled/editor";
import { useSiteContext } from "@/pages/sites/:id/contexts/site.context";
import { Slug } from "./slug";
import { Meta } from "./meta";
import { Visibility } from "./visibility";
import { DeletePage } from "./delete";

export function PageEditorContent() {
  const { selectedPage } = useSiteContext();

  if (!selectedPage) {
    console.warn(
      "No selected page in this context. This is not an expected situation."
    );
    return null;
  }

  return (
    <Editor.List>
      <Slug />
      <Meta />
      <Visibility />
      <DeletePage />
    </Editor.List>
  );
}
