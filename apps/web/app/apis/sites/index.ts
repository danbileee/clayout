import { createAxiosInstance } from "@/lib/axios/instance";
import { getQueryKey } from "@/lib/react-query/getQueryKey";
import type { CursorPagination, SiteSchema, Tables } from "@clayout/interface";
import { type AxiosResponse } from "axios";
import { z } from "zod";
import qs from "qs";
import type { PaginationParams } from "../pagination";

export type SiteBlock = Omit<Tables<"site_blocks">, "siteId" | "pageId">;

export type SitePageWithRelations = Omit<Tables<"site_pages">, "siteId"> & {
  blocks: SiteBlock[];
};

export type SiteWithRelations = Omit<Tables<"sites">, "authorId"> & {
  pages: SitePageWithRelations[];
};

/**
 * GET (all)
 */

interface GetAllEndpointParams {}

interface GetAllQueryParams {
  pagination: PaginationParams;
}

interface GetAllParams extends GetAllEndpointParams, GetAllQueryParams {}

interface GetAllResponse {
  results: CursorPagination<Tables<"sites">>;
}

export function getSitesQueryKey(params?: Partial<GetAllParams>) {
  return getQueryKey("/sites", params);
}

export async function getSites(args: {
  params: GetAllParams;
  request?: Request;
}) {
  const { params, request } = args;
  const axios = createAxiosInstance(request);
  const queryString = qs.stringify(params.pagination, { addQueryPrefix: true });
  return await axios.get<
    GetAllResponse,
    AxiosResponse<GetAllResponse, GetAllParams>,
    GetAllParams
  >(`/sites${queryString}`);
}

/**
 * GET (one)
 */

interface GetOneEndpointParams extends Pick<Tables<"sites">, "id"> {}

interface GetOneQueryParams {}

interface GetOneParams extends GetOneEndpointParams, GetOneQueryParams {}

interface GetOneResponse {
  site: SiteWithRelations;
}

export function getSiteQueryKey({ id, ...params }: Partial<GetOneParams>) {
  return getQueryKey(`/sites/${id}`, params);
}

export async function getSite(args: {
  params: GetOneParams;
  request?: Request;
}) {
  const { params, request } = args;
  const axios = createAxiosInstance(request);
  return await axios.get<
    GetOneResponse,
    AxiosResponse<GetOneResponse, GetOneParams>,
    GetOneParams
  >(`/sites/${params.id}`);
}

/**
 * POST
 */

interface PostEndpointParams {}

interface PostQueryParams {}

interface PostBody extends z.infer<typeof SiteSchema> {}

interface PostParams extends PostEndpointParams, PostQueryParams, PostBody {}

interface PostResponse {
  site: SiteWithRelations;
}

export async function postSites(args: {
  params: PostParams;
  request?: Request;
}) {
  const { params, request } = args;
  const axios = createAxiosInstance(request);
  return await axios.post<
    PostResponse,
    AxiosResponse<PostResponse, PostBody>,
    PostBody
  >(`/sites`, params);
}

/**
 * PATCH
 */

interface PatchEndpointParams extends Pick<Tables<"sites">, "id"> {}

interface PatchQueryParams {}

interface PatchBody extends Partial<z.infer<typeof SiteSchema>> {}

interface PatchParams
  extends PatchEndpointParams,
    PatchQueryParams,
    PatchBody {}

interface PatchResponse {
  site: SiteWithRelations;
}

export async function patchSites(args: {
  params: PatchParams;
  request?: Request;
}) {
  const {
    params: { id, ...params },
    request,
  } = args;
  const axios = createAxiosInstance(request);
  return await axios.patch<
    PatchResponse,
    AxiosResponse<PatchResponse, PatchBody>,
    PatchBody
  >(`/sites/${id}`, params);
}

/**
 * DELETE
 */

interface DeleteEndpointParams extends Pick<Tables<"sites">, "id"> {}

interface DeleteQueryParams {}

interface DeleteBody {}

interface DeleteParams
  extends DeleteEndpointParams,
    DeleteQueryParams,
    DeleteBody {}

interface DeleteResponse {
  id: number;
}

export async function deleteSites(args: {
  params: DeleteParams;
  request?: Request;
}) {
  const {
    params: { id },
    request,
  } = args;
  const axios = createAxiosInstance(request);
  return await axios.delete<
    DeleteResponse,
    AxiosResponse<DeleteResponse, DeleteBody>,
    DeleteBody
  >(`/sites/${id}`);
}
