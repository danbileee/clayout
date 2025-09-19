import { z } from "zod";
import { BasePaginationSchema } from "../schemas";
import { BaseEntity } from "./base.type";

export interface PagePagination<T extends BaseEntity> {
  data: T[];
  total: number;
}

export interface CursorPagination<T extends BaseEntity> {
  data: T[];
  cursor: {
    after: number | null;
  };
  count: number;
  next: string | null;
}

export type Pagination<T extends BaseEntity> =
  | PagePagination<T>
  | CursorPagination<T>;

export interface SortOption<T extends BaseEntity> {
  property: keyof T;
  direction: "asc" | "desc";
}

export interface FilterOption<T extends BaseEntity> {
  property: keyof T;
  from?: number;
  to?: number;
  contains?: string[];
}

export class PaginationOptions<T extends BaseEntity> {
  from: number = 0;
  to?: number;
  page?: number;
  take: number = 20;
  sort?: SortOption<T>[];
  filter?: FilterOption<T>[];

  static fromDto<T extends BaseEntity>(
    dto: z.infer<typeof BasePaginationSchema>
  ): PaginationOptions<T> {
    const options = new PaginationOptions<T>();
    options.from = dto.from;
    options.to = dto.to;
    options.page = dto.page;
    options.take = dto.take;

    if (dto.sort) {
      options.sort = dto.sort.split("&").map((item) => {
        const [property, direction] = item.split(":");
        return {
          property: property as keyof T,
          direction: direction.toLowerCase() as "asc" | "desc",
        };
      });
    }

    if (dto.filter) {
      options.filter = dto.filter.split("&").map((item) => {
        const [property, value] = item.split(":");
        const [from, to] = value.split("-").map(Number);

        if (from && to) {
          return { property: property as keyof T, from, to };
        }

        const contains = value.split(",");

        return { property: property as keyof T, contains };
      });
    }

    return options;
  }

  static toDto<T extends BaseEntity>({
    sort,
    filter,
    ...options
  }: PaginationOptions<T>): z.infer<typeof BasePaginationSchema> {
    return {
      ...options,
      sort: sort?.length
        ? sort.reduce((acc, { property, direction }) => {
            return `${acc}&sort=${property.toString()}:${direction}`;
          }, "")
        : undefined,
      filter: filter?.length
        ? filter.reduce((acc, { property, from, to, contains }) => {
            let value: string = "";
            if (from && to) {
              value = `${from}-${to}`;
            }
            if (contains.length) {
              if (contains.length === 1) {
                value = contains[0];
              } else {
                value = contains.join(",");
              }
            }
            return `${acc}&filter=${property.toString()}:${value}`;
          }, "")
        : undefined,
    };
  }
}
