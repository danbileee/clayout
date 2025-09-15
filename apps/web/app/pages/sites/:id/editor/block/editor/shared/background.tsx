import type { ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import * as Typo from "@/components/ui/typography";
import * as BlockEditor from "../styled";
import { HFlexBox, VFlexBox } from "@/components/ui/box";
import type { BlockContainerStyle } from "@clayout/interface";
import { IconBackground, IconRadiusBottomLeft } from "@tabler/icons-react";
import { useTheme } from "styled-components";
import { PickColorPopover } from "@/components/shared/popovers/pick-color";
import { UploadImageDialog } from "@/components/shared/dialogs/upload-image";

interface RootProps {
  children: ReactNode;
}

export function Root({ children }: RootProps) {
  return (
    <BlockEditor.Item>
      <BlockEditor.Header>
        <Typo.P size="sm" flex>
          <Icon>{IconBackground}</Icon>
          <span>Background</span>
        </Typo.P>
      </BlockEditor.Header>
      <VFlexBox gap={12}>{children}</VFlexBox>
    </BlockEditor.Item>
  );
}

type ColorProperties = Pick<BlockContainerStyle, "backgroundColor">;

interface ColorProps {
  value: ColorProperties;
  onChange: (value: ColorProperties) => Promise<void>;
}

export function Color({ value: { backgroundColor }, onChange }: ColorProps) {
  const theme = useTheme();

  return (
    <HFlexBox gap={8} isFluid>
      <Typo.P color={theme.colors.slate[600]} size="sm" flex>
        <Icon color={theme.colors.slate[300]}>{IconRadiusBottomLeft}</Icon>
        <span>Color</span>
      </Typo.P>
      <PickColorPopover
        value={backgroundColor}
        onChange={(v) => onChange({ backgroundColor: v })}
      />
    </HFlexBox>
  );
}

type ImageProperties = Pick<BlockContainerStyle, "backgroundImage">;

interface ImageProps {
  value: ImageProperties;
  onChange: (value: ImageProperties) => Promise<void>;
}

export function Image({
  value: { backgroundImage = "" },
  onChange,
}: ImageProps) {
  const theme = useTheme();

  return (
    <>
      <Typo.P
        color={theme.colors.slate[600]}
        size="sm"
        flex
        style={{ marginBottom: 6 }}
      >
        <Icon color={theme.colors.slate[300]}>{IconRadiusBottomLeft}</Icon>
        <span>Image</span>
      </Typo.P>
      <UploadImageDialog
        value={backgroundImage}
        onChange={(v) => onChange({ backgroundImage: v })}
      />
    </>
  );
}
