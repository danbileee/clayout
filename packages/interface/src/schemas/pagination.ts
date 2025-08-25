import { z } from "zod";

interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PaginationConfig<T extends BaseEntity> {
  allowedSortFields: (keyof T)[];
  allowedFilterFields: (keyof T)[];
}

export const BasePaginationSchema = z.object({
  from: z.coerce.number(),
  to: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
  take: z.coerce.number(),
  sort: z.string().optional(),
  filter: z.string().optional(),
});

function createSortPattern(allowedSortFields: string[]): RegExp {
  return new RegExp(
    `^(${allowedSortFields.join("|")}):(asc|desc)(&(${allowedSortFields.join(
      "|"
    )}):(asc|desc))*$`
  );
}

function createFilterPattern(allowedFilterFields: string[]): RegExp {
  return new RegExp(
    `^(${allowedFilterFields.join(
      "|"
    )}):((\\d+(-\\d+)?|[^&:,]+(,[^&:,]+)*))(&(${allowedFilterFields.join(
      "|"
    )}):((\\d+(-\\d+)?|[^&:,]+(,[^&:,]+)*)))*$`
  );
}

function createPaginationSchema<T extends BaseEntity>(
  config: PaginationConfig<T>
) {
  const { allowedSortFields, allowedFilterFields } = config;

  const sortPattern = createSortPattern(allowedSortFields as string[]);
  const filterPattern = createFilterPattern(allowedFilterFields as string[]);

  return BasePaginationSchema.extend({
    sort: z
      .string()
      .regex(sortPattern, {
        message: `Sort must be in format "field:direction" where field is one of: ${allowedSortFields.join(
          ", "
        )} and direction is either "asc" or "desc". Multiple sorts can be combined with "&".`,
      })
      .optional(),
    filter: z
      .string()
      .regex(filterPattern, {
        message: `Filter must be in format "field:value", "field:from-to", or "field:value1,value2,value3" where field is one of: ${allowedFilterFields.join(
          ", "
        )}. Multiple filters can be combined with "&".`,
      })
      .optional(),
  });
}

export const PaginationSchema = {
  createWithConfig: createPaginationSchema,
};
