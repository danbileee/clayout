import * as Dialog from "@/components/ui/dialog";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function UploadImageDialog({ value, onChange }: Props) {
  return (
    <Dialog.Root>
      <Dialog.Trigger></Dialog.Trigger>
      <Dialog.Content></Dialog.Content>
    </Dialog.Root>
  );
}
