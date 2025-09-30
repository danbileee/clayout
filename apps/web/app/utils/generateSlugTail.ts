import { nanoid } from "nanoid";

export function generateSlugTail(): string {
  return nanoid(4).toLowerCase().replace("_", nanoid(1));
}
