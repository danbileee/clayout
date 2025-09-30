import { useEffect } from "react";
import { useTimer } from "@/hooks/useTimer";
import { useSiteContext } from "@/pages/sites/:id/contexts/site.context";

interface Params {
  blockId: number | null;
  setBlockId: (value: number | null) => void;
}

export function useAsyncOpenBlockEditor({ blockId, setBlockId }: Params) {
  const { openBlockEditor } = useSiteContext();
  const timer = useTimer();

  /**
   * @useEffect
   * Open block in the editor after some amount of delay
   */
  useEffect(() => {
    if (blockId) {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => {
        openBlockEditor(blockId);
        setBlockId(null);
      }, 50);
    }

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [blockId, openBlockEditor, setBlockId, timer]);
}
