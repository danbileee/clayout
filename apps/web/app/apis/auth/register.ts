import { createAxiosInstance } from "@/lib/axios/instance";
import type { DB } from "@clayout/interface";
import { type AxiosResponse } from "axios";

/**
 * POST
 */

interface PostEndpointParams {}

interface PostQueryParams {}

interface PostBody
  extends Pick<DB<"users">, "username" | "email" | "password"> {}

interface PostParams extends PostEndpointParams, PostQueryParams, PostBody {}

interface PostResponse {
  message: string;
}

export async function postAuthRegister(
  { username, email, password }: PostParams,
  request?: Request
) {
  const axios = createAxiosInstance(request);
  return await axios.post<
    PostResponse,
    AxiosResponse<PostResponse, PostParams>,
    PostParams
  >(`/auth/register`, { username, email, password });
}

/**
 * PATCH
 */

interface PatchEndpointParams {}

interface PatchQueryParams {}

interface PatchBody {
  token: string;
}

interface PatchParams
  extends PatchEndpointParams,
    PatchQueryParams,
    PatchBody {}

interface PatchResponse {
  message: string;
}

export async function patchAuthRegister(
  { token }: PatchParams,
  request: Request
) {
  const axios = createAxiosInstance(request);
  return await axios.patch<
    PatchResponse,
    AxiosResponse<PatchResponse, PatchParams>,
    PatchParams
  >(`/auth/register`, { token });
}
