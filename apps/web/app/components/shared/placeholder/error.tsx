import type { HTMLAttributes, ReactNode } from "react";
import { VFlexBox } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { IconFaceIdError } from "@tabler/icons-react";
import { useTheme } from "styled-components";
import * as Typo from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface Props extends HTMLAttributes<HTMLElement> {
  children?: string | ReactNode;
}

export function ErrorPlaceholder({ children, className, ...props }: Props) {
  const theme = useTheme();

  return (
    <div
      className={cn("flex items-center justify-center h-full", className)}
      {...props}
    >
      <div className="text-center">
        <VFlexBox gap={16} alignItems="center">
          <Icon size={32} color={theme.colors.slate[200]}>
            {IconFaceIdError}
          </Icon>
          {typeof children === "string" ? (
            <Typo.P size="sm" color={theme.colors.slate[400]}>
              {children}
            </Typo.P>
          ) : (
            children
          )}
        </VFlexBox>
      </div>
    </div>
  );
}
