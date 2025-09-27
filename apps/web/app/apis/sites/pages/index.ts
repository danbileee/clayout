import { createAxiosInstance } from "@/lib/axios/instance";
import { getQueryKey } from "@/lib/react-query/getQueryKey";
import type {
  SitePageWithRelations,
  CreateSitePageDto,
  UpdateSitePageDto,
} from "@clayout/interface";
import { type AxiosResponse } from "axios";

/**
 * GET
 */

interface GetOneEndpointParams {
  siteId: number;
  pageId: number;
}

interface GetOneQueryParams {}

interface GetOneParams extends GetOneEndpointParams, GetOneQueryParams {}

interface GetOneResponse {
  page: SitePageWithRelations;
}

export function getSitePageQueryKey({
  siteId,
  pageId,
  ...params
}: Partial<GetOneParams>) {
  return getQueryKey(`/sites/${siteId}/pages/${pageId}`, params);
}

export async function getSitePage(args: {
  params: GetOneParams;
  request?: Request;
}) {
  const {
    params: { siteId, pageId },
    request,
  } = args;
  const axios = createAxiosInstance(request);
  return await axios.get<
    GetOneResponse,
    AxiosResponse<GetOneResponse, GetOneParams>,
    GetOneParams
  >(`/sites/${siteId}/pages/${pageId}`);
}

/**
 * POST
 */

interface PostEndpointParams {
  siteId: number;
}

interface PostQueryParams {}

interface PostBody extends CreateSitePageDto {}

interface PostParams extends PostEndpointParams, PostQueryParams, PostBody {}

interface PostResponse {
  page: SitePageWithRelations;
}

export async function postSitePages(args: {
  params: PostParams;
  request?: Request;
}) {
  const {
    params: { siteId, ...params },
    request,
  } = args;
  const axios = createAxiosInstance(request);
  return await axios.post<
    PostResponse,
    AxiosResponse<PostResponse, PostBody>,
    PostBody
  >(`/sites/${siteId}/pages`, params);
}

/**
 * PATCH
 */

interface PatchEndpointParams {
  siteId: number;
  pageId: number;
}

interface PatchQueryParams {}

interface PatchBody extends UpdateSitePageDto {}

interface PatchParams
  extends PatchEndpointParams,
    PatchQueryParams,
    PatchBody {}

interface PatchResponse {
  page: SitePageWithRelations;
}

export async function patchSitePages(args: {
  params: PatchParams;
  request?: Request;
}) {
  const {
    params: { siteId, pageId, ...params },
    request,
  } = args;
  const axios = createAxiosInstance(request);
  return await axios.patch<
    PatchResponse,
    AxiosResponse<PatchResponse, PatchBody>,
    PatchBody
  >(`/sites/${siteId}/pages/${pageId}`, params);
}

/**
 * PUT
 */

interface PutEndpointParams {
  siteId: number;
  pageId: number;
}

interface PutQueryParams {}

interface PutBody extends UpdateSitePageDto {}

interface PutParams extends PutEndpointParams, PutQueryParams, PutBody {}

interface PutResponse {
  page: SitePageWithRelations;
}

export async function putSitePages(args: {
  params: PutParams;
  request?: Request;
}) {
  const {
    params: { siteId, pageId, ...params },
    request,
  } = args;
  const axios = createAxiosInstance(request);
  return await axios.put<
    PutResponse,
    AxiosResponse<PutResponse, PutBody>,
    PutBody
  >(`/sites/${siteId}/pages/${pageId}`, params);
}

/**
 * DELETE
 */

interface DeleteEndpointParams {
  siteId: number;
  pageId: number;
}

interface DeleteQueryParams {}

interface DeleteBody {}

interface DeleteParams
  extends DeleteEndpointParams,
    DeleteQueryParams,
    DeleteBody {}

interface DeleteResponse {
  id: number;
}

export async function deleteSitePages(args: {
  params: DeleteParams;
  request?: Request;
}) {
  const {
    params: { siteId, pageId },
    request,
  } = args;
  const axios = createAxiosInstance(request);
  return await axios.delete<
    DeleteResponse,
    AxiosResponse<DeleteResponse, DeleteBody>,
    DeleteBody
  >(`/sites/${siteId}/pages/${pageId}`);
}
