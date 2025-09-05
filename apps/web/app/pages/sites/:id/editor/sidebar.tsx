import { styled } from "styled-components";
import { SIDEBAR_WIDTH } from "../shared/constants";
import { rem } from "@/utils/rem";
import { Menu } from "./menu";
import { SiteMenus, useSiteContext } from "../contexts/site.context";
import { Blockbar } from "./blockbar";

export function EditorSidebar() {
  const { menu } = useSiteContext();

  return (
    <Aside>
      <Menu />
      {menu === SiteMenus.Blocks && <Blockbar />}
    </Aside>
  );
}

const Aside = styled.aside`
  display: flex;
  width: ${rem(SIDEBAR_WIDTH)};
  height: 100svh;
`;
