import type { SiteWithRelations } from "@clayout/interface";
import { Button } from "@/components/ui/button";
import { forwardRef } from "react";
import { styled } from "styled-components";
import { SIDEBAR_WIDTH } from "./constants";
import { rem } from "@/utils/rem";
import { useClientMutation } from "@/lib/react-query/useClientMutation";
import { patchSitePublish } from "@/apis/sites/publish";
import { handleError } from "@/lib/axios/handleError";

interface Props {
  site: SiteWithRelations;
}

export const Header = forwardRef<HTMLDivElement, Props>(function Header(
  { site },
  ref
) {
  const { mutateAsync: publish } = useClientMutation({
    mutationFn: patchSitePublish,
  });

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
      <Title>{site.name}</Title>
      <Buttons>
        <Button>Preview</Button>
        <Button onClick={handlePublish}>Publish</Button>
      </Buttons>
    </HeaderBase>
  );
});

const HeaderBase = styled.header`
  position: fixed;
  width: calc(100% - ${rem(SIDEBAR_WIDTH)});
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${rem(16)} ${rem(20)};
  top: 0;
  left: ${rem(SIDEBAR_WIDTH)};
`;

const Title = styled.h1``;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: ${rem(12)};
`;
