import { css, styled } from "styled-components";
import * as Typo from "@/components/ui/typography";
import { rem } from "@/utils/rem";
import { BarBase } from "../shared/styled";
import { BlockData } from "@clayout/kit";
import { SiteBlockTypes, type SiteBlockType } from "@clayout/interface";
import {
  IconHandFinger,
  IconPhoto,
  IconTextSize,
  IconX,
  type Icon as TablerIcon,
} from "@tabler/icons-react";
import { Icon } from "@/components/ui/icon";

export function Blockbar() {
  const handleClickBlockButton = (key: SiteBlockType) => {
    // TODO: add block
  };

  return (
    <BarBase>
      <Typo.Large style={{ marginBottom: 16 }}>Blocks</Typo.Large>
      <BlockbarBase>
        {Object.entries(BlockData).map(([key, { type }]) => (
          <BlockButton
            key={type}
            onClick={() => handleClickBlockButton(key as SiteBlockType)}
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

const BlockIcons: Record<SiteBlockType, TablerIcon> = {
  [SiteBlockTypes.None]: IconX,
  [SiteBlockTypes.Text]: IconTextSize,
  [SiteBlockTypes.Image]: IconPhoto,
  [SiteBlockTypes.Button]: IconHandFinger,
} as const;

const BlockNames: Record<SiteBlockType, string> = {
  [SiteBlockTypes.None]: "None",
  [SiteBlockTypes.Text]: "Text",
  [SiteBlockTypes.Image]: "Image",
  [SiteBlockTypes.Button]: "Button",
} as const;
