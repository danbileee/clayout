import { z } from "zod";
import { BasePaginationSchema } from "../schemas";

export interface PagePagination<T> {
  data: T[];
  total: number;
}

export interface CursorPagination<T> {
  data: T[];
  cursor: {
    after: number | null;
  };
  count: number;
  next: string | null;
}

export type Pagination<T> = PagePagination<T> | CursorPagination<T>;

export interface PaginationParams {
  from: number;
  to?: number;
  page?: number;
  take: number;
  sort?: string;
  filter?: string;
}

export interface SortOption {
  property: string;
  direction: "asc" | "desc";
}

export interface FilterOption {
  property: string;
  from?: number;
  to?: number;
  contains?: string[];
}

export class PaginationOptions {
  from: number = 0;
  to?: number;
  page?: number;
  take: number = 20;
  sort?: SortOption[];
  filter?: FilterOption[];

  static fromDto(dto: z.infer<typeof BasePaginationSchema>): PaginationOptions {
    const options = new PaginationOptions();
    options.from = dto.from;
    options.to = dto.to;
    options.page = dto.page;
    options.take = dto.take;

    if (dto.sort) {
      options.sort = dto.sort.split("&").map((item) => {
        const [property, direction] = item.split(":");
        return {
          property,
          direction: direction.toLowerCase() as "asc" | "desc",
        };
      });
    }

    if (dto.filter) {
      options.filter = dto.filter.split("&").map((item) => {
        const [property, value] = item.split(":");
        const [from, to] = value.split("-").map(Number);

        if (from && to) {
          return { property, from, to };
        }

        const contains = value.split(",");

        return { property, contains };
      });
    }

    return options;
  }
}
