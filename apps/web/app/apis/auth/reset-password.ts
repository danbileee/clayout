import { createAxiosInstance } from "@/lib/axios/instance";
import type { DB } from "@clayout/interface";
import { type AxiosResponse } from "axios";

/**
 * POST
 */

interface PostEndpointParams {}

interface PostQueryParams {}

interface PostBody extends Pick<DB<"users">, "password"> {
  token: string;
}

interface PostParams extends PostEndpointParams, PostQueryParams, PostBody {}

interface PostResponse {
  message: string;
}

export async function postAuthResetPassword(
  { token, password }: PostParams,
  request?: Request
) {
  const axios = createAxiosInstance(request);
  return await axios.post<
    PostResponse,
    AxiosResponse<PostResponse, PostParams>,
    PostParams
  >(`/auth/reset-password`, { token, password });
}
