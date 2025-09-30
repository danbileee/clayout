import { rem } from "@/utils/rem";
import { css, styled } from "styled-components";
import { useNavigate } from "react-router";
import { useParamsId } from "@/hooks/useParamsId";
import {
  IconBookmark,
  IconClipboardText,
  IconCube,
  type Icon as TablerIcon,
} from "@tabler/icons-react";
import { Icon } from "@/components/ui/icon";
import * as Tooltip from "@/components/ui/tooltip";
import gem from "public/gem.png";
import { MENU_WIDTH } from "./constants";
import {
  SiteMenus,
  useSiteContext,
  type SiteMenu,
} from "../contexts/site.context";
import { joinPath, Paths } from "@/routes";

const MenuIcons: Record<SiteMenu, TablerIcon> = {
  Pages: IconClipboardText,
  Page: IconClipboardText,
  Blocks: IconCube,
  Block: IconCube,
  "Saved Blocks": IconBookmark,
  "Saved Block": IconBookmark,
} as const;

export function Menu() {
  const id = useParamsId();
  const navigate = useNavigate();
  const { menu, setMenu } = useSiteContext();

  const handleBack = () => {
    if (window.history.length <= 1) {
      navigate(
        joinPath([Paths.sites, ":id"], {
          ids: [
            {
              key: ":id",
              value: id,
            },
          ],
        })
      );
      return;
    }

    const referrer = document.referrer;
    const loginPath = `/${Paths.login}`;

    if (referrer.includes(loginPath)) {
      navigate(-2);
    } else {
      navigate(-1);
    }
  };

  return (
    <MenuBase>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <DashboardButton
            src={gem}
            width={30}
            height={30}
            onClick={handleBack}
          />
        </Tooltip.Trigger>
        <Tooltip.Content side="right" sideOffset={16}>
          Back to dashboard
        </Tooltip.Content>
      </Tooltip.Root>
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
    background-color: ${theme.colors.slate[200]};
    border-right: 1px solid ${theme.colors.slate[200]};
    padding: ${rem(20)} ${rem(12)};
  `}
`;

const DashboardButton = styled.img`
  cursor: pointer;
  transform: translateY(0) rotate(0);
  transition: transform ease-in-out 150ms;

  &:hover {
    transform: translateY(${rem(-2)}) rotate(4deg);
  }
`;

type MenuButtonProps = {
  $selected: boolean;
};

const MenuButton = styled.button<MenuButtonProps>`
  ${({ theme, $selected }) => css`
    background-color: ${$selected
      ? theme.colors.slate[950]
      : theme.colors.slate[50]};
    color: ${$selected ? theme.colors.slate[50] : theme.colors.slate[950]};
    padding: ${rem(13)};
    border-radius: 50%;
    transition: background-color ease-in-out 150ms;

    &:hover {
      background-color: ${$selected
        ? theme.colors.slate[800]
        : theme.colors.slate[100]};
    }

    &:active {
      background-color: ${$selected
        ? theme.colors.slate[700]
        : theme.colors.slate[200]};
    }
  `}
`;
