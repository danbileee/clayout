import {
  ErrorResponse,
  PaginationParams,
  PhotosWithTotalResults,
} from "pexels";

export type PexelsSearchDto = PaginationParams & {
  query: string;
  color?: string;
};

export type PexelsSearchResult = PhotosWithTotalResults | ErrorResponse;
