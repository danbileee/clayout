import {
  SitePageCategories,
  type SitePageCategory,
  type SitePageWithRelations,
} from "@clayout/interface";
import {
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { css, styled, useTheme } from "styled-components";
import { HInlineFlexBox } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import * as Typo from "@/components/ui/typography";
import {
  IconEye,
  IconEyeOff,
  IconFileText,
  IconFrame,
  IconHome,
  IconListDetails,
  type Icon as TablerIcon,
} from "@tabler/icons-react";
import { rem } from "@/utils/rem";
import { useSiteContext } from "../../contexts/site.context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClientMutation } from "@/lib/react-query/useClientMutation";
import { patchSitePages } from "@/apis/sites/pages";
import { handleError } from "@/lib/axios/handleError";
import { useDialog } from "@/components/ui/dialog";
import { SelectHomeDialog } from "../../dialogs/select-home";
import { patchSitePagesHome } from "@/apis/sites/pages/home";

interface Props {
  page: SitePageWithRelations;
}

export function PagebarItem({ page }: Props) {
  const theme = useTheme();
  const { site, refetchSite, page: selectedPage, setPage } = useSiteContext();
  const { openDialog, closeDialog } = useDialog();
  const [hovering, setHovering] = useState(false);
  const [editing, setEditing] = useState(false);
  const { mutateAsync: updatePage } = useClientMutation({
    mutationFn: patchSitePages,
  });
  const { mutateAsync: updateHomePage } = useClientMutation({
    mutationFn: patchSitePagesHome,
  });

  const handleClick = () => {
    setPage(page);
  };

  const handleDoubleClick = () => {
    if (!editing) {
      setEditing(true);
    }
  };

  const handleMouseEnter = () => {
    if (!hovering) {
      setHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (hovering) {
      setHovering(false);
    }
  };

  const updatePageName = async (newValue: string) => {
    const fn = async () => {
      await updatePage({
        params: {
          siteId: site.id,
          pageId: page.id,
          name: newValue,
        },
      });
      await refetchSite();
    };

    try {
      await fn();

      setEditing((prev) => !prev);
    } catch (e) {
      const { error } = await handleError(e, {
        onRetry: fn,
      });

      if (error) {
        throw error;
      }
    }
  };

  const handleBlur = async (e: FocusEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;

    updatePageName(newValue);
  };

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Escape") {
      const newValue = e.currentTarget.value;

      updatePageName(newValue);
    }
  };

  const handleToggleHome = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const submit = async (newId: number) => {
      const fn = async () => {
        await updateHomePage({
          params: {
            siteId: site.id,
            pageId: newId,
            newId,
          },
        });
        await refetchSite();
        closeDialog();
      };

      try {
        await fn();
      } catch (e) {
        const { error } = await handleError(e, {
          onRetry: fn,
        });

        if (error) {
          throw error;
        }
      }
    };

    openDialog({
      content: (
        <SelectHomeDialog
          pages={site.pages.filter((p) => p.id !== page.id)}
          onSubmit={submit}
        />
      ),
    });
  };

  const handleChangeVisible = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const fn = async () => {
      await updatePage({
        params: {
          siteId: site.id,
          pageId: page.id,
          isVisible: !page.isVisible,
        },
      });
      await refetchSite();
    };

    try {
      await fn();
    } catch (e) {
      const { error } = await handleError(e, {
        onRetry: fn,
      });

      if (error) {
        throw error;
      }
    }
  };

  return editing ? (
    <Input
      defaultValue={page.name}
      placeholder="Enter page name..."
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      autoFocus
    />
  ) : (
    <PageItem
      $selected={page.id === selectedPage?.id}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <HInlineFlexBox gap={6}>
        <Icon
          color={
            page.isVisible ? theme.colors.slate[500] : theme.colors.slate[300]
          }
        >
          {PageIcons[page.category]}
        </Icon>
        <Typo.P
          size="sm"
          color={
            page.isVisible ? theme.colors.slate[950] : theme.colors.slate[300]
          }
        >
          {page.name}
        </Typo.P>
      </HInlineFlexBox>
      <HInlineFlexBox gap={2}>
        {!page.isHome && (
          <Button
            isSquare
            variant="ghost"
            size="sm"
            onClick={handleChangeVisible}
            style={{ visibility: hovering ? "visible" : "hidden" }}
          >
            <Icon
              size={14}
              color={theme.colors.slate[page.isVisible ? 600 : 300]}
            >
              {page.isVisible ? IconEye : IconEyeOff}
            </Icon>
          </Button>
        )}
        {page.isHome && (
          <Button isSquare variant="ghost" size="sm" onClick={handleToggleHome}>
            <Icon size={14} color={theme.colors.indigo[500]}>
              {IconHome}
            </Icon>
          </Button>
        )}
      </HInlineFlexBox>
    </PageItem>
  );
}

interface PageButtonProps {
  $selected: boolean;
}

const PageItem = styled.li<PageButtonProps>`
  ${({ theme, $selected }) => css`
    cursor: pointer;
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    background-color: ${theme.colors.white};
    padding: ${rem(4)} ${rem(4)} ${rem(4)} ${rem(8)};
    border-radius: ${rem(6)};
    transition: background-color ease-in-out 150ms;

    &:hover {
      background-color: ${theme.colors.slate[100]};
    }

    &:has(:hover) {
      background-color: ${theme.colors.white};
    }

    ${$selected &&
    css`
      background-color: ${theme.colors.indigo[100]};

      &:hover {
        background-color: ${theme.colors.indigo[100]};
      }

      &:has(:hover) {
        background-color: ${theme.colors.white};
      }
    `}

    &:not(:last-of-type) {
      margin-bottom: ${rem(8)};
    }
  `}
`;

const PageIcons: Record<SitePageCategory, TablerIcon> = {
  [SitePageCategories.Static]: IconFrame,
  [SitePageCategories.List]: IconListDetails,
  [SitePageCategories.Article]: IconFileText,
};
