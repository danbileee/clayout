import { Button } from "@/components/ui/button";
import * as Dialog from "@/components/ui/dialog";
import * as Select from "@/components/ui/select";
import type { SitePageWithRelations } from "@clayout/interface";
import { useState } from "react";

interface Props {
  pages: SitePageWithRelations[];
  onSubmit: (newId: number) => Promise<void>;
}

export function SelectHomeDialog({ pages, onSubmit }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selected, setSelected] = useState(pages[0]);

  const handleValueChange = (value: string) => {
    const id = parseInt(value, 10);
    const matched = pages.find((page) => page.id === id);

    if (matched) {
      setSelected(matched);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit(selected.id);
    setIsSubmitting(false);
  };

  return (
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Select a new home page</Dialog.Title>
        <Dialog.Description>
          Home property is required. Please set a new home page instead.
        </Dialog.Description>
      </Dialog.Header>
      <Select.Root
        defaultValue={selected.id.toString()}
        onValueChange={handleValueChange}
      >
        <Select.Trigger>
          <Select.Value placeholder="Select a page" />
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Label>Pages</Select.Label>
            {pages.map((page) => (
              <Select.Item key={page.id} value={page.id.toString()}>
                {page.name}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Dialog.Footer>
        <Button onClick={handleSubmit} isLoading={isSubmitting}>
          Submit
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  );
}
