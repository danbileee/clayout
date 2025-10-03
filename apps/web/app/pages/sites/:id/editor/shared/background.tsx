import type { ReactNode } from "react";
import { useTheme } from "styled-components";
import { Icon } from "@/components/ui/icon";
import * as Typo from "@/components/ui/typography";
import * as Editor from "@/pages/sites/:id/editor/shared/styled/editor";
import { HFlexBox, VFlexBox } from "@/components/ui/box";
import { type BlockContainerStyle } from "@clayout/interface";
import { IconBackground, IconRadiusBottomLeft } from "@tabler/icons-react";
import { PickColorPopover } from "@/components/shared/popovers/pick-color";
import { rem } from "@/utils/rem";
import { HelpButton } from "@/components/shared/buttons/help";
import { ImageManager } from "./image-manager";

interface RootProps {
  children: ReactNode;
}

export function Root({ children }: RootProps) {
  return (
    <Editor.Item>
      <Editor.Header>
        <Typo.P size="sm" flex>
          <Icon>{IconBackground}</Icon>
          <span>Background</span>
        </Typo.P>
        <HelpButton>{`The image will appear on top of the\nbackground color when both are set`}</HelpButton>
      </Editor.Header>
      <VFlexBox gap={12}>{children}</VFlexBox>
    </Editor.Item>
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

type ImageProperties = Pick<
  BlockContainerStyle,
  | "backgroundImage"
  | "backgroundSize"
  | "backgroundPosition"
  | "backgroundRepeat"
>;

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
    <VFlexBox gap={8} isFluid>
      <Typo.P color={theme.colors.slate[600]} size="sm" flex>
        <Icon color={theme.colors.slate[300]}>{IconRadiusBottomLeft}</Icon>
        <span>Image</span>
      </Typo.P>
      <HFlexBox isFluid>
        <div style={{ width: rem(24) }} />
        <ImageManager
          value={backgroundImage}
          onChange={(v) =>
            onChange({
              backgroundImage: v,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            })
          }
        />
      </HFlexBox>
    </VFlexBox>
  );
}
