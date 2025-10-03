import { SitePageCategories, type SitePageCategory } from "@clayout/interface";
import { useState, type MouseEvent } from "react";
import { css, styled, useTheme } from "styled-components";
import { HInlineFlexBox } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import * as Typo from "@/components/ui/typography";
import * as Tooltip from "@/components/ui/tooltip";
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
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/input";
import { useClientMutation } from "@/lib/react-query/useClientMutation";
import { patchSitePages } from "@/apis/sites/pages";
import { handleError } from "@/lib/axios/handleError";
import { patchSitePagesHome } from "@/apis/sites/pages/home";
import { useSiteContext } from "@/pages/sites/:id/contexts/site.context";
import { useEditablePageSlug } from "../hooks/useEditablePageSlug";
import { usePageById, useUpdatePage } from "@/lib/zustand/editor";

interface Props {
  pageId: number;
  freshPageId: number | null;
  setFreshPageId: (value: number | null) => void;
}

export function PageBarItem({ pageId, freshPageId, setFreshPageId }: Props) {
  const theme = useTheme();
  const page = usePageById(pageId);
  const updatePageLocally = useUpdatePage();
  const { site, refetchSite, selectedPage, setPage } = useSiteContext();
  const [hovering, setHovering] = useState(false);
  const { mutateAsync: updatePage } = useClientMutation({
    mutationFn: patchSitePages,
  });
  const { mutateAsync: updateHomePage } = useClientMutation({
    mutationFn: patchSitePagesHome,
  });
  const {
    editing,
    inputError,
    setEditing,
    handleChange,
    handleBlur,
    handleKeyDown,
  } = useEditablePageSlug({
    pageId,
    onSuccess: () => {
      if (freshPageId === pageId) {
        setFreshPageId(null);
      }
    },
  });

  const handleClick = (e: MouseEvent<HTMLLIElement>) => {
    if (e.detail > 1) return;

    setPage(pageId);
  };

  const handleDoubleClick = (e: MouseEvent<HTMLLIElement>) => {
    e.stopPropagation();

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

  const handleToggleHome = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const prevHomePageId = site?.pages?.find((page) => page.isHome)?.id;

    if (!prevHomePageId) {
      throw new Error("prevHomePageId is required.");
    }

    const fn = async () => {
      if (!site?.id || !pageId) {
        throw new Error("siteId and pageId are required.");
      }

      updatePageLocally(pageId, { isHome: true });
      updatePageLocally(prevHomePageId, { isHome: false });

      await updateHomePage({
        params: {
          siteId: site.id,
          pageId: prevHomePageId,
          newPageId: pageId,
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
        updatePageLocally(pageId, { isHome: false });
        updatePageLocally(prevHomePageId, { isHome: true });
        throw error;
      }
    }
  };

  const handleChangeVisible = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const fn = async () => {
      if (!site?.id || !page) {
        throw Error(`siteId and page are required.`);
      }

      updatePageLocally(pageId, { isVisible: !page.isVisible });

      await updatePage({
        params: {
          siteId: site.id,
          pageId,
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
        updatePageLocally(pageId, { isVisible: page?.isVisible });
        throw error;
      }
    }
  };

  if (!page) {
    console.warn("Page not found in zustand store.");
    return null;
  }

  if (freshPageId === pageId || editing) {
    return (
      <InputWrapper>
        <Tooltip.Root open={Boolean(inputError)}>
          <Tooltip.Trigger>
            <TextInput
              defaultValue={page.slug}
              placeholder="Enter page slug..."
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
              autoFocus
            />
          </Tooltip.Trigger>
          <Tooltip.Content>{inputError}</Tooltip.Content>
        </Tooltip.Root>
      </InputWrapper>
    );
  }

  return (
    <PageItem
      selected={page.id === selectedPage?.id}
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
          {PageIcons[page.category ?? SitePageCategories.Static]}
        </Icon>
        <Typo.P
          size="sm"
          color={
            page.isVisible ? theme.colors.slate[950] : theme.colors.slate[300]
          }
          className="line-clamp-1"
        >
          {page.slug}
        </Typo.P>
      </HInlineFlexBox>
      <HInlineFlexBox gap={2}>
        {!page.isHome && (
          <>
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
            <Button
              isSquare
              variant="ghost"
              size="sm"
              onClick={handleToggleHome}
              disabled={!page.isVisible}
              style={{ visibility: hovering ? "visible" : "hidden" }}
            >
              <Icon size={14} color={theme.colors.slate[300]}>
                {IconHome}
              </Icon>
            </Button>
          </>
        )}
        {page.isHome && (
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button
                isSquare
                variant="ghost"
                size="sm"
                onClick={(e) => e.stopPropagation()}
              >
                <Icon size={14} color={theme.colors.blue[700]}>
                  {IconHome}
                </Icon>
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>This page is home</Tooltip.Content>
          </Tooltip.Root>
        )}
      </HInlineFlexBox>
    </PageItem>
  );
}

const InputWrapper = styled.div`
  width: 100%;
  padding: ${rem(3)} 0;
`;

interface PageButtonProps {
  selected: boolean;
}

const PageItem = styled.li.withConfig({
  shouldForwardProp: (prop) => {
    const nonForwardedProps = ["selected"];

    return !nonForwardedProps.includes(prop);
  },
})<PageButtonProps>`
  ${({ theme, selected }) => css`
    cursor: pointer;
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: ${rem(4)};
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

    ${selected &&
    css`
      background-color: ${theme.colors.blue[50]};

      &:hover {
        background-color: ${theme.colors.blue[50]};
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
