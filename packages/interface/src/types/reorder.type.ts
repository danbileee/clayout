import type { z } from "zod";
import { ReorderSchema } from "../schemas";

export type ReorderDto = z.infer<typeof ReorderSchema>;
