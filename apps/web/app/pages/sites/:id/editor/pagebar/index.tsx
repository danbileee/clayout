import { nanoid } from "nanoid";
import { HFlexBox } from "@/components/ui/box";
import * as Typo from "@/components/ui/typography";
import * as Tooltip from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { IconPlus } from "@tabler/icons-react";
import { css, styled } from "styled-components";
import { rem } from "@/utils/rem";
import { PagebarItem } from "./item";
import { useSiteContext } from "../../contexts/site.context";
import { BarBase } from "../../shared/styled";
import { useClientMutation } from "@/lib/react-query/useClientMutation";
import { postSitePages } from "@/apis/sites/pages";
import { handleError } from "@/lib/axios/handleError";
import { SitePageCategories } from "@clayout/interface";

export function Pagebar() {
  const { site, refetchSite, setPage } = useSiteContext();
  const { mutateAsync: createPage } = useClientMutation({
    mutationFn: postSitePages,
  });

  const handleAddPage = async () => {
    const fn = async () => {
      const response = await createPage({
        params: {
          siteId: site.id,
          slug: `new-page-${nanoid(4)}`,
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
      setPage(response.data.page);
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
      <PagebarList>
        {site.pages.map((page) => (
          <PagebarItem key={page.id} page={page} />
        ))}
      </PagebarList>
    </BarBase>
  );
}

const PagebarList = styled.ul`
  ${({ theme }) => css`
    width: 100%;
    background-color: ${theme.colors.white};
    padding: ${rem(8)};
    border: 1px solid ${theme.colors.slate[100]};
    border-radius: ${rem(8)};
  `}
`;
