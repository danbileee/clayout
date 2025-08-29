import type { SiteBlockSchema } from "@clayout/interface";
import type { JSX } from "react";
import type { z } from "zod";

export abstract class Block<T extends z.infer<typeof SiteBlockSchema>> {
  static readonly type: z.infer<typeof SiteBlockSchema>["type"];
  readonly block: T;

  constructor(block: T) {
    this.block = block;
  }

  abstract renderToJsx(props: unknown): JSX.Element;

  abstract renderToString(): string;
}
