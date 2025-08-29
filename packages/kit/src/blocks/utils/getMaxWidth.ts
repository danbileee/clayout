export function getMaxWidth(max: string, sub: string) {
  const left = sub.split(" ")[1];
  const right = sub.split(" ")[3];

  const subtraction =
    Number(left.slice(0, left.length - 2)) +
    Number(right.slice(0, right.length - 2));

  return `calc(${max} - ${subtraction}px)`;
}
