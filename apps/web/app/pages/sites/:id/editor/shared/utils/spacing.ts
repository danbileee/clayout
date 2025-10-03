interface SpacingValue {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export function parseSpacingValue(value: string): SpacingValue {
  if (!value) {
    return {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    };
  }

  const splitted = value.split(" ");

  if (splitted.length !== 4) {
    return {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    };
  }

  const [top, right, bottom, left] = splitted.map(
    (s) => parseInt(s.replace("px", "")),
    10
  );

  return {
    top,
    bottom,
    left,
    right,
  };
}

export function composeSpacingValue({
  top,
  right,
  bottom,
  left,
}: SpacingValue): string {
  return `${top}px ${right}px ${bottom}px ${left}px`;
}
