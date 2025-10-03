import { css, styled, useTheme } from "styled-components";
import { Icon } from "@/components/ui/icon";
import * as Dialog from "@/components/ui/dialog";
import * as Tooltip from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { IconPhoto, IconSettings, IconTrash } from "@tabler/icons-react";
import { HFlexBox } from "@/components/ui/box";
import { AssetPaths, AssetTargetTypes } from "@clayout/interface";
import { UploadImageDialog } from "@/components/shared/dialogs/upload-image";
import { useSiteContext } from "@/pages/sites/:id/contexts/site.context";
import { rem } from "@/utils/rem";

interface Props {
  value: string;
  onChange: (value: string) => Promise<void>;
}

export function ImageManager({ value, onChange }: Props) {
  const theme = useTheme();
  const { site } = useSiteContext();

  return (
    <Dialog.Root>
      <ImageWrapper>
        {value ? (
          <ImagePlaceholder src={value} />
        ) : (
          <Icon size={32} color={theme.colors.slate[200]}>
            {IconPhoto}
          </Icon>
        )}
        <ButtonsWrapper gap={6}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Dialog.Trigger>
                <Button isSquare size="sm" level="secondary">
                  <Icon size={14}>{IconSettings}</Icon>
                </Button>
              </Dialog.Trigger>
            </Tooltip.Trigger>
            <Tooltip.Content>Manage images</Tooltip.Content>
          </Tooltip.Root>
          {value && (
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Button
                  isSquare
                  size="sm"
                  level="secondary"
                  onClick={() => onChange("")}
                >
                  <Icon size={14}>{IconTrash}</Icon>
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>Remove image</Tooltip.Content>
            </Tooltip.Root>
          )}
        </ButtonsWrapper>
      </ImageWrapper>
      <UploadImageDialog
        value={value}
        onChange={onChange}
        options={{
          createAssetDto: {
            path: `${AssetPaths.Site}/${site?.id ?? "temp"}`,
            targetId: site?.id ?? 0,
            targetType: AssetTargetTypes.Site,
          },
        }}
      />
    </Dialog.Root>
  );
}

const ImageWrapper = styled.div`
  ${({ theme }) => css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    aspect-ratio: 4 / 2.5;
    background-color: ${theme.colors.slate[50]};
    border: 1px solid ${theme.colors.slate[200]};
    border-radius: ${rem(8)};
    overflow: hidden;
  `}
`;

const ImagePlaceholder = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ButtonsWrapper = styled(HFlexBox)`
  position: absolute;
  top: ${rem(8)};
  right: ${rem(8)};
`;
