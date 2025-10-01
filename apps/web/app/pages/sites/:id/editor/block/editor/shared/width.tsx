import * as Typo from "@/components/ui/typography";
import * as Select from "@/components/ui/select";
import * as Editor from "@/pages/sites/:id/editor/styled/editor";
import { Icon } from "@/components/ui/icon";
import { IconArrowAutofitWidth } from "@tabler/icons-react";
import { HFlexBox } from "@/components/ui/box";
import { NumberInput } from "@/components/ui/input";
import { type BlockContainerStyle } from "@clayout/interface";

const Units = {
  None: "auto",
  Static: "px",
  Relative: "%",
} as const;

type ParsedWidth = {
  value: number | string;
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

      if (width === "auto") {
        return {
          value: "auto",
          unit: Units.None,
        };
      }

      return acc;
    },
    {
      value: 0,
      unit: Units.Static,
    }
  );

  const handleValueChange = (v: string) => {
    if (v === Units.None) {
      return onChange({ width: v });
    }

    if (parsed.unit === Units.None && v !== Units.None) {
      return onChange({ width: `100${v}` });
    }

    onChange({
      width: `${parsed.value}${v}`,
    });
  };

  return (
    <Editor.Item>
      <Editor.Header>
        <Typo.P size="sm" flex>
          <Icon>{IconArrowAutofitWidth}</Icon>
          <span>Width</span>
        </Typo.P>
      </Editor.Header>
      <HFlexBox gap={8}>
        {([Units.Static, Units.Relative] as string[]).includes(parsed.unit) && (
          <NumberInput
            value={parsed.value}
            onChange={(e) =>
              onChange({ width: `${e.target.value}${parsed.unit}` })
            }
          />
        )}
        <Select.Root
          defaultValue={parsed.unit}
          onValueChange={handleValueChange}
        >
          <Select.Trigger>
            <Select.Value placeholder="Select unit" />
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              <Select.Label>Units</Select.Label>
              {Object.entries(Units).map(([key, value]) => (
                <Select.Item
                  key={key}
                  value={value}
                >{`${value} (${key})`}</Select.Item>
              ))}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </HFlexBox>
    </Editor.Item>
  );
}
