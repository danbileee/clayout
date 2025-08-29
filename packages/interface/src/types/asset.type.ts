import { z } from "zod";
import {
  AssetSchema,
  AssetUploadInputSchema,
  PaginateAssetsSchema,
} from "../schemas";

export type CreateAssetDto = z.infer<typeof AssetSchema>;

export type UpdateAssetDto = Partial<CreateAssetDto>;

export type PaginateAssetDto = z.infer<typeof PaginateAssetsSchema>;

export type UploadAssetInputDto = z.infer<typeof AssetUploadInputSchema>;
