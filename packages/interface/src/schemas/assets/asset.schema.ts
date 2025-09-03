import { z, ZodType } from "zod";
import { Constants, Tables } from "../../types";
import { PaginationSchema } from "../pagination";

const assetShape = {
  order: z.number().optional(),
  targetType: z.enum(Constants.assets_targettype_enum),
  targetId: z.number(),
  path: z.string(),
} satisfies Record<
  keyof Pick<Tables<"assets">, "order" | "targetType" | "targetId" | "path">,
  ZodType
>;

export const AssetSchema = z.object(assetShape);

export const PaginateAssetsSchema = PaginationSchema.createWithConfig<
  Tables<"assets">
>({
  allowedSortFields: ["createdAt", "updatedAt", "order", "path"],
  allowedFilterFields: ["createdAt", "updatedAt", "targetId", "targetType"],
});

export const AssetUploadInputSchema = z.object({
  key: z.string(),
  contentType: z.string(),
});
