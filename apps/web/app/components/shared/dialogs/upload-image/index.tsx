import { Button } from "@/components/ui/button";
import * as Dialog from "@/components/ui/dialog";
import * as Tooltip from "@/components/ui/tooltip";
import * as Tab from "@/components/ui/tabs";
import { Icon } from "@/components/ui/icon";
import { IconPhoto, IconTrash, IconUpload } from "@tabler/icons-react";
import { HFlexBox } from "@/components/ui/box";
import { css, styled, useTheme } from "styled-components";
import { rem } from "@/utils/rem";
import { Manual } from "./manual";
import { Search } from "./search";
import type { Props } from "./types";

const Tabs = {
  Manual: "Manual",
  Search: "Search",
} as const;

type Tab = keyof typeof Tabs;

export function UploadImageDialog({ value, options, onChange }: Props) {
  const theme = useTheme();

  return (
    <Dialog.Root>
      <ImagePlaceholder backgroundImage={value}>
        <Icon size={32} color={theme.colors.slate[200]}>
          {IconPhoto}
        </Icon>
        <ButtonsWrapper gap={8}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Dialog.Trigger>
                <Button isSquare size="sm" level="secondary">
                  <Icon size={14}>{IconUpload}</Icon>
                </Button>
              </Dialog.Trigger>
            </Tooltip.Trigger>
            <Tooltip.Content>Upload image</Tooltip.Content>
          </Tooltip.Root>
          {value && (
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Button isSquare size="sm" level="secondary">
                  <Icon size={14}>{IconTrash}</Icon>
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>Remove image</Tooltip.Content>
            </Tooltip.Root>
          )}
        </ButtonsWrapper>
      </ImagePlaceholder>
      <Dialog.Content style={{ width: rem(870) }}>
        <Dialog.Header>
          <Dialog.Title>Upload images</Dialog.Title>
        </Dialog.Header>
        <Tab.Root defaultValue={Tabs.Manual}>
          <Tab.List>
            <Tab.Trigger value={Tabs.Manual}>Manually</Tab.Trigger>
            <Tab.Trigger value={Tabs.Search}>Via search</Tab.Trigger>
          </Tab.List>
          <Tab.Content value={Tabs.Manual}>
            <Manual onChange={onChange} options={options} />
          </Tab.Content>
          <Tab.Content value={Tabs.Search}>
            <Search onChange={onChange} />
          </Tab.Content>
        </Tab.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
}

interface ImagePlaceholderProps {
  backgroundImage: string;
}

const ImagePlaceholder = styled.div.withConfig({
  shouldForwardProp: (prop) => {
    const nonForwardedProps = ["backgroundImage"];

    return !nonForwardedProps.includes(prop);
  },
})<ImagePlaceholderProps>`
  ${({ theme, backgroundImage }) => css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    aspect-ratio: 4 / 2.5;
    background-color: ${theme.colors.slate[50]};
    border: 1px solid ${theme.colors.slate[200]};
    border-radius: ${rem(8)};

    ${backgroundImage &&
    css`
      background-image: ${backgroundImage};
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    `}
  `}
`;

const ButtonsWrapper = styled(HFlexBox)`
  position: absolute;
  top: ${rem(8)};
  right: ${rem(8)};
`;
