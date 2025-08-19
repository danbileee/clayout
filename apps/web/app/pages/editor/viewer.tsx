import { cn } from "@/lib/utils";
import { SIDEBAR_WIDTH } from "./constants";

export function EditorViewer() {
  return (
    <main className={cn(`w-[calc(100%_-_${SIDEBAR_WIDTH}px)]`)}>Main</main>
  );
}
