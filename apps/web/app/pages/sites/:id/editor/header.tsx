import { Button } from "@/components/ui/button";
import * as Typo from "@/components/ui/typography";
import * as Tooltip from "@/components/ui/tooltip";
import { forwardRef, useEffect } from "react";
import { css, styled } from "styled-components";
import { SIDEBAR_WIDTH } from "./constants";
import { rem } from "@/utils/rem";
import { useClientMutation } from "@/lib/react-query/useClientMutation";
import { patchSitePublish } from "@/apis/sites/publish";
import { handleError } from "@/lib/axios/handleError";
import { Icon } from "@/components/ui/icon";
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconChevronLeft,
  IconShare,
} from "@tabler/icons-react";
import { useNavigate } from "react-router";
import { joinPath, Paths } from "@/routes";
import { useParamsId } from "@/hooks/useParamsId";
import { HFlexBox } from "@/components/ui/box";
import { toast } from "sonner";
import { useEditorHistory } from "./hooks/useEditorHistory";
import { useSiteContext } from "../contexts/site.context";

export const Header = forwardRef<HTMLDivElement, {}>(function Header(
  _props,
  ref
) {
  const id = useParamsId();
  const navigate = useNavigate();
  const { site, primaryDomain, selectedPage, selectedPageId } =
    useSiteContext();
  const { mutateAsync: publish, isPending: isPublishing } = useClientMutation({
    mutationFn: patchSitePublish,
  });
  const { undo, redo, canUndo, canRedo, updateDB } = useEditorHistory();

  const handleUndo = async () => {
    if (!selectedPageId) return;

    const result = undo(selectedPageId);
    await updateDB.current(result);
  };

  const handleRedo = async () => {
    if (!selectedPageId) return;

    const result = redo(selectedPageId);
    await updateDB.current(result);
  };

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

  const handlePublish = async () => {
    const fn = async () => {
      if (!site?.id) {
        throw new Error("siteId is required.");
      }

      await publish({ params: { id: site.id } });
      toast.success("Published sucessfully! 🚀");
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

  /**
   * @useEffect
   * Add keyboard shortcuts for undo/redo functionality
   * - Cmd/Ctrl + Z: Undo
   * - Cmd/Ctrl + Shift + Z: Redo
   * - Cmd/Ctrl + Y: Redo (alternative)
   */
  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (!selectedPageId) return;

      const isModifierPressed = event.metaKey || event.ctrlKey;

      if (!isModifierPressed) return;

      if (event.key === "z" || event.key === "y") {
        event.preventDefault();
      }

      // Undo: Cmd/Ctrl + Z (without Shift)
      if (event.key === "z" && !event.shiftKey) {
        const result = undo(selectedPageId);
        await updateDB.current(result);
      }

      // Redo: Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y
      if ((event.key === "z" && event.shiftKey) || event.key === "y") {
        const result = redo(selectedPageId);
        await updateDB.current(result);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo, selectedPageId, updateDB]);

  return (
    <HeaderBase ref={ref}>
      <HFlexBox gap={12}>
        <Button isSquare variant="ghost" onClick={handleBack}>
          <Icon>{IconChevronLeft}</Icon>
        </Button>
        <Typo.P
          weight="medium"
          style={{ display: "flex", alignItems: "center" }}
        >
          {primaryDomain && (
            <SiteName hasPage={Boolean(selectedPage)}>
              {primaryDomain.hostname}
            </SiteName>
          )}
          {selectedPage && (
            <>
              <span style={{ paddingLeft: rem(4), paddingRight: rem(6) }}>
                /
              </span>
              <span>{selectedPage.slug}</span>
            </>
          )}
        </Typo.P>
      </HFlexBox>
      <HFlexBox gap={12}>
        <HFlexBox gap={4}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button
                isSquare
                variant="ghost"
                onClick={handleUndo}
                disabled={!selectedPageId || !canUndo}
              >
                <Icon>{IconArrowBackUp}</Icon>
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>Undo</Tooltip.Content>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button
                isSquare
                variant="ghost"
                onClick={handleRedo}
                disabled={!selectedPageId || !canRedo}
              >
                <Icon>{IconArrowForwardUp}</Icon>
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>Redo</Tooltip.Content>
          </Tooltip.Root>
        </HFlexBox>
        <Button size="lg" variant="ghost">
          Preview
        </Button>
        <Button
          size="lg"
          startIcon={<Icon>{IconShare}</Icon>}
          onClick={handlePublish}
          isLoading={isPublishing}
        >
          Publish
        </Button>
      </HFlexBox>
    </HeaderBase>
  );
});

const HeaderBase = styled.header`
  position: fixed;
  width: calc(100% - ${rem(SIDEBAR_WIDTH)});
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${rem(10)} ${rem(20)};
  top: 0;
  left: ${rem(SIDEBAR_WIDTH)};
`;

interface SiteNameProps {
  hasPage: boolean;
}

const SiteName = styled.span.withConfig({
  shouldForwardProp: (prop) => {
    const nonForwardedProps = ["hasPage"];

    return !nonForwardedProps.includes(prop);
  },
})<SiteNameProps>`
  ${({ theme, hasPage }) => css`
    color: ${hasPage ? theme.colors.slate[600] : theme.colors.slate[900]};
    font-weight: ${hasPage ? "normal" : "medium"};
  `}
`;
