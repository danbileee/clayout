export abstract class Block {
  data: unknown;

  constructor(data: unknown) {
    this.data = data;
  }

  abstract render(props: unknown): unknown;

  abstract renderToString(): unknown;
}
