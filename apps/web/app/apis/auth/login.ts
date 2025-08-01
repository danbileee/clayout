import { createAxiosInstance } from "@/lib/axios/instance";
import type { DB } from "@clayout/interface";
import { type AxiosResponse } from "axios";

/**
 * POST
 */

interface PostEndpointParams {}

interface PostQueryParams {}

interface PostBody extends Pick<DB<"users">, "email" | "password"> {}

interface PostParams extends PostEndpointParams, PostQueryParams, PostBody {}

interface PostResponse {
  message: string;
}

export async function postAuthLogin(args: {
  params: PostParams;
  request?: Request;
}) {
  const { params, request } = args;
  const axios = createAxiosInstance(request);
  return await axios.post<
    PostResponse,
    AxiosResponse<PostResponse, PostParams>,
    PostParams
  >(`/auth/login`, params);
}
