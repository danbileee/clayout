import { Button } from "@/components/ui/button";
import * as Dialog from "@/components/ui/dialog";
import type { ComponentProps } from "react";

interface Props {
  title?: string;
  description?: string;
  confirmButtonProps: ComponentProps<typeof Button>;
}

export function ConfirmDeleteDialog({
  title = "Delete this item?",
  description = "This action cannot be undone.",
  confirmButtonProps,
}: Props) {
  return (
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>{description}</Dialog.Description>
      </Dialog.Header>
      <Dialog.Footer>
        <Button level="destructive" {...confirmButtonProps}>
          {confirmButtonProps.children ?? "Confirm"}
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  );
}
