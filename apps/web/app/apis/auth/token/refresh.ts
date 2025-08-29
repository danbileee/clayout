import { createAxiosInstance } from "@/lib/axios/instance";
import { type AxiosResponse } from "axios";

/**
 * POST
 */

interface PostEndpointParams {}

interface PostQueryParams {}

interface PostBody {}

interface PostParams extends PostEndpointParams, PostQueryParams, PostBody {}

interface PostResponse {
  message: string;
}

export async function postAuthTokenRefresh(args?: {
  params?: PostParams;
  request?: Request;
}) {
  const { request } = args ?? {};
  const axios = createAxiosInstance(request);
  return await axios.post<
    PostResponse,
    AxiosResponse<PostResponse, PostBody>,
    PostBody
  >(`/auth/token/refresh`);
}
