import React, { forwardRef, type CSSProperties } from "react";
import {
  styled,
  css,
  type DefaultTheme,
  type RuleSet,
} from "styled-components";
import LoadingIcon from "public/loading_20.svg";
import { rem } from "@/utils/rem";

const ButtonVariants = {
  filled: "filled",
  outlined: "outlined",
  ghost: "ghost",
} as const;

const ButtonLevels = {
  primary: "primary",
  secondary: "secondary",
  destructive: "destructive",
} as const;

const ButtonSizes = {
  sm: "sm",
  md: "md",
  lg: "lg",
} as const;

const ButtonRadiuses = {
  rounded: "rounded",
  full: "full",
} as const;

const ButtonStates = {
  enabled: "enabled",
  hovered: "hovered",
  disabled: "disabled",
  focused: "focused",
  pressed: "pressed",
} as const;

const ButtonAlignments = {
  center: "center",
  left: "left",
  right: "right",
  stretch: "stretch",
} as const;

type ButtonVariant = keyof typeof ButtonVariants;
type ButtonLevel = keyof typeof ButtonLevels;
type ButtonSize = keyof typeof ButtonSizes;
type ButtonRadius = keyof typeof ButtonRadiuses;
type ButtonState = keyof typeof ButtonStates;
type ButtonAlignment = keyof typeof ButtonAlignments;

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  level?: ButtonLevel;
  size?: ButtonSize;
  radius?: ButtonRadius;
  alignment?: ButtonAlignment;
  state?: ButtonState;
  isLoading?: boolean;
  isFluid?: boolean;
  isSquare?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    variant = "filled",
    level = "primary",
    size = "md",
    radius = "rounded",
    alignment = "center",
    state,
    isLoading = false,
    isFluid = false,
    isSquare = false,
    startIcon,
    endIcon,
    ...props
  },
  ref
) {
  return (
    <ButtonBase
      ref={ref}
      type="button"
      tabIndex={0}
      variant={variant}
      level={level}
      radius={radius}
      size={size}
      alignment={alignment}
      state={state}
      isLoading={isLoading}
      isFluid={isFluid}
      isSquare={isSquare}
      hasStartIcon={Boolean(startIcon)}
      hasEndIcon={Boolean(endIcon)}
      {...props}
    >
      {startIcon}
      <span>{props.children}</span>
      {endIcon}
      {isLoading && <StyledLoadingIcon variant={variant} level={level} />}
    </ButtonBase>
  );
});

type ButtonBaseProps = Required<
  Pick<
    Props,
    | "variant"
    | "level"
    | "size"
    | "radius"
    | "alignment"
    | "isFluid"
    | "isLoading"
    | "isSquare"
  >
> &
  Pick<Props, "state"> & {
    hasStartIcon: boolean;
    hasEndIcon: boolean;
  };

const commonButtonStyle = css`
  position: relative;
  display: inline-flex;
  align-items: center;
  transition: all ease-in-out 150ms;

  > span {
    white-space: nowrap;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const ButtonBase = styled.button<ButtonBaseProps>`
  ${commonButtonStyle};

  ${({
    variant,
    level,
    size,
    radius,
    alignment,
    state,
    isFluid,
    isSquare,
    hasStartIcon,
    hasEndIcon,
    theme,
  }) => {
    return css`
      ${generateVariantStyle({ variant, level, state, theme })};
      ${generateSizeStyle({ size, hasStartIcon, hasEndIcon, theme, isSquare })};
      ${radiusStyles[radius]};
      ${alignmentStyles[alignment]}
      ${isFluid && fluidStyle};
    `;
  }}

  ${({ variant, level, isLoading, theme }) => {
    const { enabled } = generateCSSProperty({
      variant,
      level,
      theme,
    });
    return css`
      ${isLoading &&
      css`
        color: transparent;
        pointer-events: none;
        overflow: hidden;
        &:after {
          content: "";
          position: absolute;
          inset: 0;
          background-color: ${enabled.backgroundColor};
        }
      `}
    `;
  }};
`;

type LoadingProps = Required<Pick<Props, "variant" | "level">>;

const StyledLoadingIcon = styled(LoadingIcon)<LoadingProps>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  ${({ variant, level, theme }) => {
    const { enabled } = generateCSSProperty({
      variant,
      level,
      theme,
    });
    return css`
      color: ${enabled.color} !important;
    `;
  }};
`;

type ButtonCSSProperties = {
  color: string;
  backgroundColor: string;
  border: string;
  boxShadow?: string;
};

type GeneratedCSSProperties = Record<ButtonState, ButtonCSSProperties>;

const FOCUSED_BOX_SHADOW = "inset 0 0 0 3px rgba(0, 0, 0, 0.10)";

const getPrimaryFilled = (theme: DefaultTheme): GeneratedCSSProperties => ({
  enabled: {
    color: theme.colors.white,
    backgroundColor: theme.colors.slate[950],
    border: `1px solid ${theme.colors.slate[950]}`,
  },
  disabled: {
    color: theme.colors.slate[500],
    backgroundColor: theme.colors.slate[200],
    border: `1px solid ${theme.colors.slate[200]}`,
  },
  hovered: {
    color: theme.colors.white,
    backgroundColor: theme.colors.slate[800],
    border: `1px solid ${theme.colors.slate[800]}`,
  },
  pressed: {
    color: theme.colors.white,
    backgroundColor: theme.colors.neutral[700],
    border: `1px solid ${theme.colors.neutral[700]}`,
  },
  focused: {
    color: theme.colors.white,
    backgroundColor: theme.colors.slate[800],
    border: `1px solid ${theme.colors.slate[800]}`,
    boxShadow: FOCUSED_BOX_SHADOW,
  },
});

const generateVariantLevelErrorMessage = ({
  level,
  variant,
}: {
  level: ButtonLevel;
  variant: ButtonVariant;
}): string => {
  return `This Button doesn't support ${variant}/${level} style.`;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
function generateCSSProperty({
  variant,
  level,
  theme,
}: {
  variant: ButtonVariant;
  level: ButtonLevel;
  theme: DefaultTheme;
}): GeneratedCSSProperties {
  switch (variant) {
    case "filled":
      if (level === "primary") {
        return getPrimaryFilled(theme);
      }
      if (level === "secondary") {
        return {
          enabled: {
            color: theme.colors.slate[900],
            backgroundColor: theme.colors.slate[200],
            border: `1px solid ${theme.colors.slate[200]}`,
          },
          disabled: {
            color: theme.colors.slate[500],
            backgroundColor: theme.colors.slate[300],
            border: `1px solid ${theme.colors.slate[300]}`,
          },
          hovered: {
            color: theme.colors.slate[950],
            backgroundColor: theme.colors.slate[300],
            border: `1px solid ${theme.colors.slate[300]}`,
          },
          pressed: {
            color: theme.colors.neutral[900],
            backgroundColor: theme.colors.slate[400],
            border: `1px solid ${theme.colors.slate[400]}`,
          },
          focused: {
            color: theme.colors.slate[950],
            backgroundColor: theme.colors.slate[300],
            border: `1px solid ${theme.colors.slate[300]}`,
            boxShadow: FOCUSED_BOX_SHADOW,
          },
        };
      }
      if (level === "destructive") {
        return {
          enabled: {
            color: theme.colors.white,
            backgroundColor: theme.colors.red[600],
            border: `1px solid ${theme.colors.red[600]}`,
          },
          disabled: {
            color: theme.colors.neutral[600],
            backgroundColor: theme.colors.red[200],
            border: `1px solid ${theme.colors.red[200]}`,
          },
          hovered: {
            color: theme.colors.white,
            backgroundColor: theme.colors.red[700],
            border: `1px solid ${theme.colors.red[700]}`,
          },
          pressed: {
            color: theme.colors.white,
            backgroundColor: theme.colors.red[800],
            border: `1px solid ${theme.colors.red[800]}`,
          },
          focused: {
            color: theme.colors.white,
            backgroundColor: theme.colors.red[700],
            border: `1px solid ${theme.colors.red[700]}`,
            boxShadow: FOCUSED_BOX_SHADOW,
          },
        };
      }
      return getPrimaryFilled(theme);
    case "outlined":
      if (level === "primary") {
        console.error(generateVariantLevelErrorMessage({ level, variant }));
      }
      if (level === "secondary") {
        return {
          enabled: {
            color: theme.colors.slate[800],
            backgroundColor: theme.colors.white,
            border: `1px solid ${theme.colors.slate[200]}`,
          },
          disabled: {
            color: theme.colors.slate[500],
            backgroundColor: theme.colors.white,
            border: `1px solid ${theme.colors.slate[100]}`,
          },
          hovered: {
            color: theme.colors.slate[900],
            backgroundColor: theme.colors.white,
            border: `1px solid ${theme.colors.slate[300]}`,
          },
          pressed: {
            color: theme.colors.slate[950],
            backgroundColor: theme.colors.white,
            border: `1px solid ${theme.colors.slate[400]}`,
          },
          focused: {
            color: theme.colors.slate[900],
            backgroundColor: theme.colors.white,
            border: `1px solid ${theme.colors.slate[300]}`,
            boxShadow: FOCUSED_BOX_SHADOW,
          },
        };
      }
      if (level === "destructive") {
        return {
          enabled: {
            color: theme.colors.red[600],
            backgroundColor: theme.colors.white,
            border: `1px solid ${theme.colors.red[600]}`,
          },
          disabled: {
            color: theme.colors.red[400],
            backgroundColor: theme.colors.white,
            border: `1px solid ${theme.colors.red[300]}`,
          },
          hovered: {
            color: theme.colors.red[700],
            backgroundColor: theme.colors.white,
            border: `1px solid ${theme.colors.red[700]}`,
          },
          pressed: {
            color: theme.colors.red[800],
            backgroundColor: theme.colors.white,
            border: `1px solid ${theme.colors.red[800]}`,
          },
          focused: {
            color: theme.colors.red[700],
            backgroundColor: theme.colors.white,
            border: `1px solid ${theme.colors.red[700]}`,
            boxShadow: FOCUSED_BOX_SHADOW,
          },
        };
      }
      return getPrimaryFilled(theme);
    case "ghost":
      if (level === "primary") {
        return {
          enabled: {
            color: theme.colors.slate[800],
            backgroundColor: "transparent",
            border: `1px solid transparent`,
          },
          disabled: {
            color: theme.colors.slate[500],
            backgroundColor: "transparent",
            border: `1px solid transparent`,
          },
          hovered: {
            color: theme.colors.slate[950],
            backgroundColor: theme.colors.slate[100],
            border: `1px solid ${theme.colors.slate[100]}`,
          },
          pressed: {
            color: theme.colors.neutral[900],
            backgroundColor: theme.colors.slate[200],
            border: `1px solid ${theme.colors.slate[200]}`,
          },
          focused: {
            color: theme.colors.slate[950],
            backgroundColor: theme.colors.slate[100],
            border: `1px solid ${theme.colors.slate[100]}`,
            boxShadow: FOCUSED_BOX_SHADOW,
          },
        };
      }
      if (level === "secondary") {
        console.error(generateVariantLevelErrorMessage({ level, variant }));
      }
      if (level === "destructive") {
        return {
          enabled: {
            color: theme.colors.red[600],
            backgroundColor: "transparent",
            border: `1px solid transparent`,
          },
          disabled: {
            color: theme.colors.red[400],
            backgroundColor: "transparent",
            border: `1px solid transparent`,
          },
          hovered: {
            color: theme.colors.red[700],
            backgroundColor: "transparent",
            border: `1px solid transparent`,
          },
          pressed: {
            color: theme.colors.red[800],
            backgroundColor: "transparent",
            border: `1px solid transparent`,
          },
          focused: {
            color: theme.colors.red[600],
            backgroundColor: "transparent",
            border: `1px solid transparent`,
            boxShadow: FOCUSED_BOX_SHADOW,
          },
        };
      }
      return getPrimaryFilled(theme);
    default:
      return getPrimaryFilled(theme);
  }
}

function generateVariantStyle({
  variant,
  level,
  state,
  theme,
}: {
  variant: ButtonVariant;
  level: ButtonLevel;
  state?: ButtonState;
  theme: DefaultTheme;
}): RuleSet<object> {
  const { enabled, disabled, hovered, focused, pressed } = generateCSSProperty({
    variant,
    level,
    theme,
  });

  switch (state) {
    case ButtonStates.enabled:
      return css`
        border: ${enabled.border};
        background-color: ${enabled.backgroundColor};
        color: ${enabled.color};
      `;
    case ButtonStates.hovered:
      return css`
        border: ${hovered.border};
        background-color: ${hovered.backgroundColor};
        color: ${hovered.color};
      `;
    case ButtonStates.disabled:
      return css`
        border: ${disabled.border};
        background-color: ${disabled.backgroundColor};
        color: ${disabled.color};
        cursor: not-allowed;
      `;
    case ButtonStates.focused:
      return css`
        border: ${focused.border};
        background-color: ${focused.backgroundColor};
        color: ${focused.color};
        box-shadow: ${focused.boxShadow};
      `;
    case ButtonStates.pressed:
      return css`
        border: ${pressed.border};
        background-color: ${pressed.backgroundColor};
        color: ${pressed.color};
      `;
    default:
      return css`
        border: ${enabled.border};
        background-color: ${enabled.backgroundColor};
        color: ${enabled.color};
        &:hover {
          border: ${hovered.border};
          background-color: ${hovered.backgroundColor};
          color: ${hovered.color};
        }
        &:active {
          border: ${pressed.border};
          background-color: ${pressed.backgroundColor};
          color: ${pressed.color};
        }
        &:focus-visible {
          border: ${focused.border};
          background-color: ${focused.backgroundColor};
          color: ${focused.color};
          box-shadow: ${focused.boxShadow};
        }
        &:disabled,
        &:disabled:hover,
        &:disabled:active,
        &:disabled:focus-visible {
          border: ${disabled.border};
          background-color: ${disabled.backgroundColor};
          color: ${disabled.color};
          cursor: not-allowed;
        }
      `;
  }
}

const getSizeStyles = (
  isSquare: boolean
): Record<ButtonSize, RuleSet<object>> => ({
  sm: css`
    gap: ${rem(4)};
    height: ${rem(24)};
    line-height: ${rem(24)};
    padding: ${isSquare ? rem(4) : `${rem(4)} ${rem(8)}`};
  `,
  md: css`
    gap: ${rem(6)};
    height: ${rem(32)};
    line-height: ${rem(32)};
    padding: ${isSquare ? rem(6) : `${rem(6)} ${rem(16)}`};
  `,
  lg: css`
    gap: ${rem(8)};
    height: ${rem(36)};
    line-height: ${rem(36)};
    padding: ${isSquare ? rem(8) : `${rem(8)} ${rem(20)}`};
  `,
});

const sizeStylesForIconPadding: Record<
  ButtonSize,
  Pick<CSSProperties, "paddingLeft" | "paddingRight">
> = {
  sm: {
    paddingLeft: 6,
    paddingRight: 6,
  },
  md: {
    paddingLeft: 12,
    paddingRight: 12,
  },
  lg: {
    paddingLeft: 16,
    paddingRight: 16,
  },
};

const getSizeFontStyle = (
  theme: DefaultTheme
): Record<ButtonSize, RuleSet<object>> => {
  return {
    sm: css`
      font-size: ${rem(13)};
    `,
    md: css`
      font-size: ${rem(14)};
    `,
    lg: css`
      font-size: ${rem(15)};
    `,
  };
};

function generateSizeStyle({
  theme,
  size,
  hasStartIcon,
  hasEndIcon,
  isSquare,
}: {
  theme: DefaultTheme;
  size: ButtonSize;
  hasStartIcon: boolean;
  hasEndIcon: boolean;
  isSquare: boolean;
}): RuleSet<object> {
  const iconPaddingStyle = sizeStylesForIconPadding[size];

  return css`
    ${getSizeFontStyle(theme)[size]};
    ${getSizeStyles(isSquare)[size]};
    ${hasStartIcon &&
    css`
      padding-left: ${iconPaddingStyle.paddingLeft}px;
    `};
    ${hasEndIcon &&
    css`
      padding-right: ${iconPaddingStyle.paddingRight}px;
    `};
  `;
}

const radiusStyles: Record<ButtonRadius, RuleSet<object>> = {
  rounded: css`
    border-radius: ${rem(6)};
  `,
  full: css`
    border-radius: ${rem(100)};
  `,
};

const fluidStyle = css`
  width: 100%;
`;

const alignmentStyles: Record<ButtonAlignment, RuleSet<object>> = {
  center: css`
    justify-content: center;
  `,
  left: css`
    justify-content: flex-start;
  `,
  right: css`
    justify-content: flex-end;
  `,
  stretch: css`
    justify-content: space-between;
    > span {
      margin-right: auto;
    }
  `,
};
