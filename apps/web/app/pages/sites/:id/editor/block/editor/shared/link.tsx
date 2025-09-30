import * as Typo from "@/components/ui/typography";
import * as BlockEditor from "../styled";
import { Icon } from "@/components/ui/icon";
import { IconLink } from "@tabler/icons-react";
import { VFlexBox } from "@/components/ui/box";
import { TextInput } from "@/components/ui/input";
import { useTheme } from "styled-components";

type LinkProperties = { link?: string };

interface Props {
  id: string;
  value: LinkProperties;
  error?: string;
  onChange: (value: LinkProperties) => void;
}

export function Link({ id, value, error, onChange }: Props) {
  const theme = useTheme();
  const { link } = value;

  return (
    <BlockEditor.Item>
      <BlockEditor.Header>
        <Typo.P size="sm" flex>
          <Icon>{IconLink}</Icon>
          <span>Link</span>
        </Typo.P>
      </BlockEditor.Header>
      <VFlexBox gap={6}>
        <TextInput
          id={id}
          value={link}
          onChange={(e) =>
            onChange({
              link: e.target.value,
            })
          }
          placeholder="Enter an external link"
        />
        {error && (
          <Typo.P size="xs" color={theme.colors.slate[400]}>
            {error}
          </Typo.P>
        )}
      </VFlexBox>
    </BlockEditor.Item>
  );
}
