import type { SitePageWithRelations } from "@/apis/sites";
import { Block } from "./block";

interface Props {
  page: SitePageWithRelations;
}

export function Page({ page }: Props) {
  return (
    <table cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
      <tbody>
        {page.blocks.map((block) => (
          <Block key={block.id} block={block} />
        ))}
      </tbody>
    </table>
  );
}
