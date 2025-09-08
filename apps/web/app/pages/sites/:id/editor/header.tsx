import type { SiteWithRelations } from "@clayout/interface";
import { Button } from "@/components/ui/button";
import * as Typo from "@/components/ui/typography";
import { forwardRef } from "react";
import { styled } from "styled-components";
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

interface Props {
  site: SiteWithRelations;
}

export const Header = forwardRef<HTMLDivElement, Props>(function Header(
  { site },
  ref
) {
  const id = useParamsId();
  const navigate = useNavigate();
  const { mutateAsync: publish } = useClientMutation({
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
        <Typo.P weight="medium">{site.name}</Typo.P>
      </HFlexBox>
      <HFlexBox gap={12}>
        <Button size="lg" variant="ghost">
          Preview
        </Button>
        <Button
          size="lg"
          startIcon={<Icon>{IconShare}</Icon>}
          onClick={handlePublish}
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
