interface Props {
  children: string;
}

export function Text({ children }: Props) {
  return <p>{children}</p>;
}
