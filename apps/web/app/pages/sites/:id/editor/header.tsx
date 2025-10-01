import { Button } from "@/components/ui/button";
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
  IconShare,
} from "@tabler/icons-react";
import { HFlexBox } from "@/components/ui/box";
import { toast } from "sonner";
import { AutosizeInput } from "@/components/ui/input";
import { trigger } from "@/lib/tailwindcss/presets";
import { cn } from "@/lib/tailwindcss/merge";
import { useHandleChangePageSlug } from "./hooks/useHandleChangePageSlug";
import { useEditorHistory } from "./hooks/useEditorHistory";
import { useSiteContext } from "../contexts/site.context";

export const Header = forwardRef<HTMLDivElement, {}>(function Header(
  _props,
  ref
) {
  const { site, primaryDomain, selectedPage, selectedPageId } =
    useSiteContext();
  const { mutateAsync: publish, isPending: isPublishing } = useClientMutation({
    mutationFn: patchSitePublish,
  });
  const { undo, redo, canUndo, canRedo, updateDB } = useEditorHistory();
  const {
    editing,
    inputError,
    setEditing,
    handleChange,
    handleBlur,
    handleKeyDown,
  } = useHandleChangePageSlug({
    pageId: selectedPageId,
  });

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
      <HFlexBox gap={2}>
        {primaryDomain && (
          <SiteName
            hasPage={Boolean(selectedPage)}
            className="truncate max-w-sm"
          >
            {primaryDomain.hostname}
          </SiteName>
        )}
        {selectedPage && (
          <>
            <span style={{ paddingLeft: rem(4), paddingRight: rem(4) }}>/</span>
            {editing ? (
              <Tooltip.Root open={Boolean(inputError)}>
                <Tooltip.Trigger>
                  <AutosizeInput
                    size="sm"
                    placeholder="Enter page slug..."
                    className="max-w-3xs"
                    value={selectedPage.slug}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                </Tooltip.Trigger>
                <Tooltip.Content>{inputError}</Tooltip.Content>
              </Tooltip.Root>
            ) : (
              <span
                className={cn(trigger, "truncate max-w-sm")}
                onClick={() => setEditing(true)}
              >
                {selectedPage.slug}
              </span>
            )}
          </>
        )}
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
