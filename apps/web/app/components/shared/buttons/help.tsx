import type { ReactNode } from "react";
import * as Tooltip from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { IconInfoCircle } from "@tabler/icons-react";
import { useTheme } from "styled-components";

interface Props {
  children: ReactNode;
}

export function HelpButton({ children }: Props) {
  const theme = useTheme();

  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <Button isSquare size="sm" variant="ghost">
          <Icon color={theme.colors.slate[500]}>{IconInfoCircle}</Icon>
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>{children}</Tooltip.Content>
    </Tooltip.Root>
  );
}
