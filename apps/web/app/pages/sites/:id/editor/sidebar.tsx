import { styled } from "styled-components";
import { BLOCKBAR_WIDTH, MENU_WIDTH, SIDEBAR_WIDTH } from "./constants";
import { Button } from "@/components/ui/button";
import { rem } from "@/utils/rem";

export function EditorSidebar() {
  return (
    <Aside>
      <Menu>Menu</Menu>
      <Blockbar>
        <Buttons>
          <Button>Text</Button>
          <Button>Image</Button>
          <Button>Button</Button>
        </Buttons>
      </Blockbar>
    </Aside>
  );
}

const Aside = styled.aside`
  display: flex;
  width: ${rem(SIDEBAR_WIDTH)};
  height: 100svh;
`;

const Menu = styled.div`
  width: ${rem(MENU_WIDTH)};
`;

const Blockbar = styled.div`
  width: ${rem(BLOCKBAR_WIDTH)};
  padding: ${rem(20)};
`;

const Buttons = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${rem(20)};
`;
