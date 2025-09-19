import * as Dialog from "@/components/ui/dialog";
import * as Tab from "@/components/ui/tabs";
import { rem } from "@/utils/rem";
import { Manual } from "./manual";
import { Search } from "./search";
import type { Props } from "./types";

const Tabs = {
  Search: "Search",
  Manual: "Manual",
} as const;

type Tab = keyof typeof Tabs;

export function UploadImageDialog({ value, options, onChange }: Props) {
  return (
    <Dialog.Content style={{ width: rem(870) }}>
      <Dialog.Header>
        <Dialog.Title>Upload images</Dialog.Title>
      </Dialog.Header>
      <Tab.Root defaultValue={Tabs.Search}>
        <Tab.List>
          <Tab.Trigger value={Tabs.Search}>Via search</Tab.Trigger>
          <Tab.Trigger value={Tabs.Manual}>Manually</Tab.Trigger>
        </Tab.List>
        <Tab.Content value={Tabs.Search}>
          <Search onChange={onChange} />
        </Tab.Content>
        <Tab.Content value={Tabs.Manual}>
          <Manual value={value} onChange={onChange} options={options} />
        </Tab.Content>
      </Tab.Root>
    </Dialog.Content>
  );
}
