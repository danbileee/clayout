import { rem } from "@/utils/rem";
import { css, styled } from "styled-components";
import { MENU_WIDTH } from "../shared/constants";
import {
  SiteMenus,
  useSiteContext,
  type SiteMenu,
} from "../contexts/site.context";
import {
  IconBookmark,
  IconClipboardText,
  IconCube,
  type Icon as TablerIcon,
} from "@tabler/icons-react";
import { Icon } from "@/components/ui/icon";
import * as Tooltip from "@/components/ui/tooltip";

const MenuIcons: Record<SiteMenu, TablerIcon> = {
  Pages: IconClipboardText,
  Page: IconClipboardText,
  Blocks: IconCube,
  Block: IconCube,
  "Saved Blocks": IconBookmark,
  "Saved Block": IconBookmark,
} as const;

export function Menu() {
  const { menu, setMenu } = useSiteContext();

  return (
    <MenuBase>
      {Object.values(SiteMenus)
        .filter((m) =>
          (
            [
              SiteMenus.Pages,
              SiteMenus.Blocks,
              SiteMenus["Saved Blocks"],
            ] as SiteMenu[]
          ).includes(m)
        )
        .map((m) => (
          <Tooltip.Root key={m}>
            <Tooltip.Trigger>
              <MenuButton
                $selected={m === menu || m === `${menu}s`}
                onClick={() => setMenu(m)}
              >
                <Icon>{MenuIcons[m]}</Icon>
              </MenuButton>
            </Tooltip.Trigger>
            <Tooltip.Content side="right" sideOffset={12}>
              {m}
            </Tooltip.Content>
          </Tooltip.Root>
        ))}
    </MenuBase>
  );
}

const MenuBase = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${rem(16)};
    width: ${rem(MENU_WIDTH)};
    background-color: ${theme.colors.slate["900"]};
    padding: ${rem(20)} ${rem(12)};
  `}
`;

type MenuButtonProps = {
  $selected: boolean;
};

const MenuButton = styled.button<MenuButtonProps>`
  ${({ theme, $selected }) => css`
    background-color: ${$selected
      ? theme.colors.indigo[500]
      : theme.colors.slate[50]};
    color: ${$selected ? theme.colors.slate[50] : theme.colors.slate[950]};
    padding: ${rem(13)};
    border-radius: 50%;
    transition: background-color ease-in-out 150ms;

    &:hover {
      background-color: ${$selected
        ? theme.colors.indigo[600]
        : theme.colors.slate[200]};
    }

    &:active {
      background-color: ${$selected
        ? theme.colors.indigo[700]
        : theme.colors.slate[300]};
    }
  `}
`;
