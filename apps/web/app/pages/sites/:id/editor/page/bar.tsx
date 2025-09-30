import { nanoid } from "nanoid";
import { HFlexBox } from "@/components/ui/box";
import * as Typo from "@/components/ui/typography";
import * as Tooltip from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { IconPlus } from "@tabler/icons-react";
import { css, styled } from "styled-components";
import { rem } from "@/utils/rem";
import { PageBarItem } from "./bar-item";
import { useSiteContext } from "../../contexts/site.context";
import { BarBase } from "../styled";
import { useClientMutation } from "@/lib/react-query/useClientMutation";
import { postSitePages } from "@/apis/sites/pages";
import { handleError } from "@/lib/axios/handleError";
import { SitePageCategories } from "@clayout/interface";
import { useState } from "react";

export function PageBar() {
  const { site, refetchSite, setPage } = useSiteContext();
  const { mutateAsync: createPage } = useClientMutation({
    mutationFn: postSitePages,
  });
  const [freshPageId, setFreshPageId] = useState<number | null>(null);

  const handleAddPage = async () => {
    const fn = async () => {
      if (!site?.id) return;

      const response = await createPage({
        params: {
          siteId: site.id,
          slug: `new-page-${nanoid(4).toLowerCase()}`,
          name: "New Page",
          category: SitePageCategories.Static,
          meta: site.meta ?? undefined,
          order: site.pages.length,
          isHome: false,
          isVisible: true,
          blocks: [],
        },
      });
      await refetchSite();
      setFreshPageId(response.data.page.id);
      setPage(response.data.page.id);
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
    <BarBase>
      <HFlexBox justifyContent="space-between" style={{ marginBottom: 16 }}>
        <Typo.P size="lg" weight="semibold">
          Pages
        </Typo.P>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Button isSquare variant="ghost" onClick={handleAddPage}>
              <Icon>{IconPlus}</Icon>
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>Add a new page</Tooltip.Content>
        </Tooltip.Root>
      </HFlexBox>
      <PageBarList>
        {site ? (
          site.pages.map((page) => (
            <PageBarItem
              key={page.id}
              page={page}
              freshPageId={freshPageId}
              setFreshPageId={setFreshPageId}
            />
          ))
        ) : (
          <></>
        )}
      </PageBarList>
    </BarBase>
  );
}

const PageBarList = styled.ul`
  ${({ theme }) => css`
    width: 100%;
    background-color: ${theme.colors.white};
    padding: ${rem(8)};
    border: 1px solid ${theme.colors.slate[100]};
    border-radius: ${rem(8)};
  `}
`;
