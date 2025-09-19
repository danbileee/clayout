import { BarBase } from "../styled";
import * as Typo from "@/components/ui/typography";

export function SavedBlockBar() {
  return (
    <BarBase>
      <Typo.P size="lg" weight="semibold" style={{ marginBottom: 16 }}>
        Saved Blocks
      </Typo.P>
      <div></div>
    </BarBase>
  );
}
