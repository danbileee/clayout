import * as Typo from "@/components/ui/typography";
import * as Select from "@/components/ui/select";
import * as BlockEditor from "../styled";
import { Icon } from "@/components/ui/icon";
import { IconArrowAutofitWidth } from "@tabler/icons-react";
import { HFlexBox } from "@/components/ui/box";
import { Input } from "@/components/ui/input";
import { type BlockContainerStyle } from "@clayout/interface";

const Units = {
  Static: "px",
  Relative: "%",
} as const;

type ParsedWidth = {
  value: number;
  unit: string;
};

type WidthProperties = Pick<BlockContainerStyle, "width">;

interface Props {
  value: WidthProperties;
  onChange: (value: WidthProperties) => Promise<void>;
}

export function Width({ value, onChange }: Props) {
  const { width = "" } = value;
  const parsed = Object.entries(Units).reduce<ParsedWidth>(
    (acc, [, value]) => {
      if (width.includes(value)) {
        return {
          value: parseInt(width.replace(value, ""), 10),
          unit: value,
        };
      }

      return acc;
    },
    {
      value: 0,
      unit: Units.Static,
    }
  );

  return (
    <BlockEditor.Item>
      <BlockEditor.Header>
        <Typo.P size="sm" flex>
          <Icon>{IconArrowAutofitWidth}</Icon>
          <span>Width</span>
        </Typo.P>
      </BlockEditor.Header>
      <HFlexBox gap={8}>
        <Input
          type="tel"
          value={parsed.value}
          onChange={(e) =>
            onChange({ width: `${e.target.value}${parsed.unit}` })
          }
        />
        <Select.Root
          defaultValue={parsed.unit}
          onValueChange={(v) => onChange({ width: `${parsed.value}${v}` })}
        >
          <Select.Trigger>
            <Select.Value placeholder="Select a page" />
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              <Select.Label>Units</Select.Label>
              {Object.entries(Units).map(([key, value]) => (
                <Select.Item value={value}>{`${value} (${key})`}</Select.Item>
              ))}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </HFlexBox>
    </BlockEditor.Item>
  );
}
