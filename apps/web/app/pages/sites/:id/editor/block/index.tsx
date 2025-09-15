import { BlockRegistry } from "@clayout/kit";
import { SiteBlockSchema } from "@clayout/interface";
import { styled } from "styled-components";
import { useSiteContext } from "../../contexts/site.context";
import type { MouseEvent } from "react";
import { useBlockById } from "@/lib/zustand/editor";

interface Props {
  blockId: string;
}

export function Block({ blockId }: Props) {
  const { page, block: selected, openBlockEditor } = useSiteContext();
  const blockSchema = useBlockById(blockId);
  const block = page?.blocks.find((b) => b.id === blockSchema.id);
  const parsedBlock = SiteBlockSchema.parse(blockSchema);
  const registerdBlock = new BlockRegistry().find(parsedBlock);

  const handleClickBlock = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (!block || selected === block) return;

    openBlockEditor(block);
  };

  return (
    <BlockBase onClick={handleClickBlock}>
      {registerdBlock.renderToJsx()}
      <BlockCover />
    </BlockBase>
  );
}

const BlockBase = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  display: flow-root;
  box-sizing: content-box;
`;

const BlockCover = styled.div`
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  z-index: 1;
`;
