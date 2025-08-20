import type { SiteWithRelations } from "@/apis/sites";
import { SIDEBAR_WIDTH } from "./constants";
import { styled } from "styled-components";
import { Page } from "./page";

interface Props {
  site: SiteWithRelations;
}

export function EditorViewer({ site }: Props) {
  const [page] = site.pages;

  return (
    <Main>
      <Canvas>{page ? <Page page={page} /> : null}</Canvas>
    </Main>
  );
}

const Main = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - ${SIDEBAR_WIDTH}px);
  height: auto;
  padding: 40px;
`;

const Canvas = styled.div`
  width: 768px;
`;
