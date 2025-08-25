import { createAxiosInstance } from "@/lib/axios/instance";
import { getQueryKey } from "@/lib/react-query/getQueryKey";
import type {
  CursorPagination,
  Tables,
  PaginateAssetDto,
  CreateAssetDto,
  UpdateAssetDto,
  UploadAssetInputDto,
} from "@clayout/interface";
import { type AxiosResponse } from "axios";
import qs from "qs";

/**
 * GET (all)
 */

interface GetAllEndpointParams {}

interface GetAllQueryParams extends PaginateAssetDto {}

interface GetAllParams extends GetAllEndpointParams, GetAllQueryParams {}

interface GetAllResponse {
  results: CursorPagination<Tables<"assets">>;
}

export function getAssetsQueryKey(params?: Partial<GetAllParams>) {
  return getQueryKey("/assets", params);
}

export async function getAssets(args: {
  params: GetAllParams;
  request?: Request;
}) {
  const { params, request } = args;
  const axios = createAxiosInstance(request);
  const queryString = qs.stringify(params, { addQueryPrefix: true });
  return await axios.get<
    GetAllResponse,
    AxiosResponse<GetAllResponse, GetAllParams>,
    GetAllParams
  >(`/assets${queryString}`);
}

/**
 * GET (one)
 */

interface GetOneEndpointParams extends Pick<Tables<"assets">, "id"> {}

interface GetOneQueryParams {}

interface GetOneParams extends GetOneEndpointParams, GetOneQueryParams {}

interface GetOneResponse {
  asset: Tables<"assets">;
}

export function getAssetQueryKey({ id, ...params }: Partial<GetOneParams>) {
  return getQueryKey(`/assets/${id}`, params);
}

export async function getAsset(args: {
  params: GetOneParams;
  request?: Request;
}) {
  const { params, request } = args;
  const axios = createAxiosInstance(request);
  return await axios.get<
    GetOneResponse,
    AxiosResponse<GetOneResponse, GetOneParams>,
    GetOneParams
  >(`/assets/${params.id}`);
}

/**
 * GET (signed url)
 */

interface GetSignedUrlEndpointParams {}

interface GetSignedUrlQueryParams extends UploadAssetInputDto {}

interface GetSignedUrlParams
  extends GetSignedUrlEndpointParams,
    GetSignedUrlQueryParams {}

interface GetSignedUrlResponse {
  signedUrl: string;
}

export function getAssetSignedUrlQueryKey(params: Partial<GetSignedUrlParams>) {
  return getQueryKey(`/assets/signed-url`, params);
}

export async function getAssetSignedUrl(args: {
  params: GetSignedUrlParams;
  request?: Request;
}) {
  const { params, request } = args;
  const axios = createAxiosInstance(request);
  const queryString = qs.stringify(params, { addQueryPrefix: true });
  return await axios.get<
    GetSignedUrlResponse,
    AxiosResponse<GetSignedUrlResponse, GetSignedUrlParams>,
    GetSignedUrlParams
  >(`/assets/signed-url${queryString}`);
}

/**
 * PUT
 */
export async function uploadFile(signedUrl: string, file: File) {
  return await fetch(signedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });
}

/**
 * POST
 */

interface PostEndpointParams {}

interface PostQueryParams {}

interface PostBody extends CreateAssetDto {}

interface PostParams extends PostEndpointParams, PostQueryParams, PostBody {}

interface PostResponse {
  asset: Tables<"assets">;
}

export async function postAssets(args: {
  params: PostParams;
  request?: Request;
}) {
  const { params, request } = args;
  const axios = createAxiosInstance(request);
  return await axios.post<
    PostResponse,
    AxiosResponse<PostResponse, PostBody>,
    PostBody
  >(`/assets`, params);
}

/**
 * PATCH
 */

interface PatchEndpointParams extends Pick<Tables<"assets">, "id"> {}

interface PatchQueryParams {}

interface PatchBody extends UpdateAssetDto {}

interface PatchParams
  extends PatchEndpointParams,
    PatchQueryParams,
    PatchBody {}

interface PatchResponse {
  asset: Tables<"assets">;
}

export async function patchAssets(args: {
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
  >(`/assets/${id}`, params);
}

/**
 * DELETE
 */

interface DeleteEndpointParams extends Pick<Tables<"assets">, "id"> {}

interface DeleteQueryParams {}

interface DeleteBody {}

interface DeleteParams
  extends DeleteEndpointParams,
    DeleteQueryParams,
    DeleteBody {}

interface DeleteResponse {
  id: number;
}

export async function deleteAssets(args: {
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
  >(`/assets/${id}`);
}
