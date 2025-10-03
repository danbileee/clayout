import { useState } from "react";
import { css, styled } from "styled-components";
import * as Typo from "@/components/ui/typography";
import { rem } from "@/utils/rem";
import { BarBase } from "../shared/styled";
import { BlockData } from "@clayout/kit";
import {
  SiteBlockSchema,
  type CreateSiteBlockDto,
  type SiteBlockType,
} from "@clayout/interface";
import { Icon } from "@/components/ui/icon";
import { useClientMutation } from "@/lib/react-query/useClientMutation";
import { postSiteBlocks } from "@/apis/sites/pages/blocks";
import { handleError } from "@/lib/axios/handleError";
import { useSiteContext } from "@/pages/sites/:id/contexts/site.context";
import { getSiteBlockSlugValidation } from "@/apis/sites/pages/blocks/slug-duplication";
import { generateSlugTail } from "@/utils/generateSlugTail";
import { BlockIcons, BlockNames } from "../constants";
import { useAsyncOpenBlockEditor } from "../hooks/useAsyncOpenBlockEditor";
import { useAddBlock } from "@/lib/zustand/editor";

export function BlockBar() {
  const { site, selectedPageId, refetchSite } = useSiteContext();
  const { mutateAsync: addBlock } = useClientMutation({
    mutationFn: postSiteBlocks,
  });
  const [createdBlockId, setCreatedBlockId] = useState<number | null>(null);
  const addBlockLocally = useAddBlock();

  const handleClickBlockButton = async (data: CreateSiteBlockDto) => {
    const fn = async () => {
      if (!site?.id || !selectedPageId) return;

      const { data: isSlugDuplicated } = await getSiteBlockSlugValidation({
        params: {
          siteId: site.id,
          pageId: selectedPageId,
          slug: data.slug ?? "",
        },
      });

      const response = await addBlock({
        params: {
          siteId: site.id,
          pageId: selectedPageId,
          block: isSlugDuplicated
            ? {
                ...data,
                slug: `${data.slug}-${generateSlugTail()}`,
              }
            : data,
        },
      });

      await refetchSite();

      const parsed = SiteBlockSchema.safeParse(response.data.block);

      if (parsed.success) {
        addBlockLocally(selectedPageId, parsed.data);
      }

      setCreatedBlockId(response.data.block.id);
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
   * Open created block in the editor after some amount of delay
   * because the site data isn't updated right after the creation succeed
   */
  useAsyncOpenBlockEditor({
    blockId: createdBlockId,
    setBlockId: setCreatedBlockId,
  });

  return (
    <BarBase>
      <Typo.P size="lg" weight="semibold" style={{ marginBottom: 16 }}>
        Blocks
      </Typo.P>
      <BlockbarBase>
        {Object.entries(BlockData).map(([key, data]) => (
          <BlockButton
            key={data.type}
            onClick={() => handleClickBlockButton(data)}
          >
            <Icon size={24}>{BlockIcons[key as SiteBlockType]}</Icon>
            <Typo.P style={{ fontSize: 14 }}>
              {BlockNames[key as SiteBlockType]}
            </Typo.P>
          </BlockButton>
        ))}
      </BlockbarBase>
    </BarBase>
  );
}

const BlockbarBase = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${rem(16)};
`;

const BlockButton = styled.button`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${rem(8)};
    color: ${theme.colors.slate[900]};
    background-color: ${theme.colors.white};
    padding: ${rem(16)} ${rem(8)} ${rem(12)};
    border: 1px solid ${theme.colors.neutral[100]};
    border-radius: ${rem(8)};
    box-shadow: ${theme.shadow.light};
    transition: border-color, box-shadow ease-in-out 200ms;

    &:hover {
      border-color: ${theme.colors.neutral[200]};
      box-shadow: ${theme.shadow.medium};
    }

    &:active {
      border-color: ${theme.colors.neutral[300]};
      box-shadow: ${theme.shadow.medium};
    }
  `}
`;
