import { z } from "zod";

const reorderShape = {
  sourceId: z.number(),
  targetId: z.number(),
};

export const ReorderSchema = z.object(reorderShape);
