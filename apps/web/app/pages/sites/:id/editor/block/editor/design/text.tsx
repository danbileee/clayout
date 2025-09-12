import type { z } from "zod";
import { TextBlockSchema } from "@clayout/interface";
import type { BlockEditorProps } from "../types";

export function TextEditorDesign({
  block,
}: BlockEditorProps<z.infer<typeof TextBlockSchema>>) {
  return (
    <div>
      <div>TextEditorDesign</div>
    </div>
  );
}
