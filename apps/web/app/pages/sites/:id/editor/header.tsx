import { Button } from "@/components/ui/button";
import * as Typo from "@/components/ui/typography";
import { forwardRef } from "react";
import { css, styled } from "styled-components";
import { SIDEBAR_WIDTH } from "../shared/constants";
import { rem } from "@/utils/rem";
import { useClientMutation } from "@/lib/react-query/useClientMutation";
import { patchSitePublish } from "@/apis/sites/publish";
import { handleError } from "@/lib/axios/handleError";
import { Icon } from "@/components/ui/icon";
import { IconChevronLeft, IconShare } from "@tabler/icons-react";
import { useNavigate } from "react-router";
import { joinPath, Paths } from "@/routes";
import { useParamsId } from "@/hooks/useParamsId";
import { HFlexBox } from "@/components/ui/box";
import { useSiteContext } from "../contexts/site.context";
import { toast } from "sonner";

export const Header = forwardRef<HTMLDivElement, {}>(function Header(
  props,
  ref
) {
  const id = useParamsId();
  const navigate = useNavigate();
  const { site, page } = useSiteContext();
  const { mutateAsync: publish, isPending: isPublishing } = useClientMutation({
    mutationFn: patchSitePublish,
  });

  const handleBack = () => {
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
  };

  const handlePublish = async () => {
    const fn = async () => {
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

  return (
    <HeaderBase ref={ref}>
      <HFlexBox gap={12}>
        <Button isSquare variant="ghost" onClick={handleBack}>
          <Icon>{IconChevronLeft}</Icon>
        </Button>
        <Typo.P weight="medium">
          <SiteName hasPage={Boolean(page)}>{site.name}</SiteName>
          {page && (
            <>
              <Slash>/</Slash>
              <span>{page.name}</span>
            </>
          )}
        </Typo.P>
      </HFlexBox>
      <HFlexBox gap={12}>
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

const Slash = styled.span`
  ${({ theme }) => css`
    color: ${theme.colors.slate[400]};
    font-weight: normal;
    padding-left: ${rem(12)};
    padding-right: ${rem(12)};
  `}
`;
