export interface PaginationParams {
  from: number;
  to?: number;
  page?: number;
  take: number;
  sort?: string;
  filter?: string;
}
