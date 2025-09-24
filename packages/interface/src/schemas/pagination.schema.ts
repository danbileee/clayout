import { z } from "zod";
import { BaseEntity } from "../types";

interface PaginationConfig<T extends BaseEntity> {
  allowedSortProperties: (keyof T)[];
  allowedFilterProperties: (keyof T)[];
}

export const BasePaginationSchema = z.object({
  from: z.coerce.number(),
  to: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
  take: z.coerce.number(),
  sort: z.string().optional(),
  filter: z.string().optional(),
});

function createSortPattern(allowedSortProperties: string[]): RegExp {
  return new RegExp(
    `^(${allowedSortProperties.join(
      "|"
    )}):(asc|desc)(&(${allowedSortProperties.join("|")}):(asc|desc))*$`
  );
}

function createFilterPattern(allowedFilterProperties: string[]): RegExp {
  return new RegExp(
    `^(${allowedFilterProperties.join(
      "|"
    )}):((\\d+(-\\d+)?|[^&:,]+(,[^&:,]+)*))(&(${allowedFilterProperties.join(
      "|"
    )}):((\\d+(-\\d+)?|[^&:,]+(,[^&:,]+)*)))*$`
  );
}

function createPaginationSchema<T extends BaseEntity>(
  config: PaginationConfig<T>
) {
  const { allowedSortProperties, allowedFilterProperties } = config;

  const sortPattern = createSortPattern(allowedSortProperties as string[]);
  const filterPattern = createFilterPattern(
    allowedFilterProperties as string[]
  );

  return BasePaginationSchema.extend({
    sort: z
      .string()
      .regex(sortPattern, {
        message: `Sort must be in format "property:direction" where property is one of: ${allowedSortProperties.join(
          ", "
        )} and direction is either "asc" or "desc". Multiple sorts can be combined with "&".`,
      })
      .optional(),
    filter: z
      .string()
      .regex(filterPattern, {
        message: `Filter must be in format "property:value", "property:from-to", or "property:value1,value2,value3" where property is one of: ${allowedFilterProperties.join(
          ", "
        )}. Multiple filters can be combined with "&".`,
      })
      .optional(),
  });
}

export const PaginationSchema = {
  createWithConfig: createPaginationSchema,
};
