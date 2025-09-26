import { createAxiosInstance } from "@/lib/axios/instance";
import { getQueryKey } from "@/lib/react-query/getQueryKey";
import type {
  CreateSiteBlockDto,
  UpdateSiteBlockDto,
  SiteBlock,
} from "@clayout/interface";
import { type AxiosResponse } from "axios";

/**
 * GET
 */

interface GetOneEndpointParams {
  siteId: number;
  pageId: number;
  blockId: number;
}

interface GetOneQueryParams {}

interface GetOneParams extends GetOneEndpointParams, GetOneQueryParams {}

interface GetOneResponse {
  block: SiteBlock;
}

export function getSiteBlockQueryKey({
  siteId,
  pageId,
  blockId,
  ...params
}: Partial<GetOneParams>) {
  return getQueryKey(
    `/sites/${siteId}/pages/${pageId}/blocks/${blockId}`,
    params
  );
}

export async function getSiteBlock(args: {
  params: GetOneParams;
  request?: Request;
}) {
  const {
    params: { siteId, pageId, blockId },
    request,
  } = args;
  const axios = createAxiosInstance(request);
  return await axios.get<
    GetOneResponse,
    AxiosResponse<GetOneResponse, GetOneParams>,
    GetOneParams
  >(`/sites/${siteId}/pages/${pageId}/blocks/${blockId}`);
}

/**
 * POST
 */

interface PostEndpointParams {
  siteId: number;
  pageId: number;
}

interface PostQueryParams {}

interface PostBody {
  block: CreateSiteBlockDto;
}

interface PostParams extends PostEndpointParams, PostQueryParams, PostBody {}

interface PostResponse {
  block: SiteBlock;
}

export async function postSiteBlocks(args: {
  params: PostParams;
  request?: Request;
}) {
  const {
    params: { siteId, pageId, block },
    request,
  } = args;
  const axios = createAxiosInstance(request);
  return await axios.post<
    PostResponse,
    AxiosResponse<PostResponse, CreateSiteBlockDto>,
    CreateSiteBlockDto
  >(`/sites/${siteId}/pages/${pageId}/blocks`, block);
}

/**
 * PATCH
 */

interface PatchEndpointParams {
  siteId: number;
  pageId: number;
  blockId: number;
}

interface PatchQueryParams {}

interface PatchBody {
  block: UpdateSiteBlockDto;
}

interface PatchParams
  extends PatchEndpointParams,
    PatchQueryParams,
    PatchBody {}

interface PatchResponse {
  block: SiteBlock;
}

export async function patchSiteBlocks(args: {
  params: PatchParams;
  request?: Request;
}) {
  const {
    params: { siteId, pageId, blockId, block },
    request,
  } = args;
  const axios = createAxiosInstance(request);
  return await axios.patch<
    PatchResponse,
    AxiosResponse<PatchResponse, UpdateSiteBlockDto>,
    UpdateSiteBlockDto
  >(`/sites/${siteId}/pages/${pageId}/blocks/${blockId}`, block);
}

/**
 * DELETE
 */

interface DeleteEndpointParams {
  siteId: number;
  pageId: number;
  blockId: number;
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

export async function deleteSiteBlocks(args: {
  params: DeleteParams;
  request?: Request;
}) {
  const {
    params: { siteId, pageId, blockId },
    request,
  } = args;
  const axios = createAxiosInstance(request);
  return await axios.delete<
    DeleteResponse,
    AxiosResponse<DeleteResponse, DeleteBody>,
    DeleteBody
  >(`/sites/${siteId}/pages/${pageId}/blocks/${blockId}`);
}
