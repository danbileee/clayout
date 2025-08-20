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
