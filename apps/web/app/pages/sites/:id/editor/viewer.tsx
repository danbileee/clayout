import { styled } from "styled-components";
import useMeasure from "react-use-measure";
import { SIDEBAR_WIDTH } from "./constants";
import { Page } from "./page";
import { Header } from "./header";
import { rem } from "@/utils/rem";

export function EditorViewer() {
  const [headerRef, { height: headerHeight }] = useMeasure();

  return (
    <Wrapper>
      <Header ref={headerRef} />
      <Page headerHeight={headerHeight} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100% - ${rem(SIDEBAR_WIDTH)});
`;
