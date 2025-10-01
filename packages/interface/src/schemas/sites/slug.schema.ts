import { z } from "zod";
import { KebabCase } from "../patterns";

export const slugSchema = z
  .string()
  .min(1, "Slug must contain at least 1 character.")
  .max(100, "Slug could contain maximum 100 characters.")
  .regex(
    KebabCase,
    `Slug must be in kebab-case\n(lowercase letters, numbers, and hyphens only)`
  );
