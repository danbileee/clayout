import { createAxiosInstance } from "@/lib/axios/instance";
import { getQueryKey } from "@/lib/react-query/getQueryKey";
import type { AxiosResponse } from "axios";
import qs from "qs";

/**
 * GET
 */

interface GetEndpointParams {
  siteId: number;
  pageId: number;
}

interface GetQueryParams {
  slug: string;
}

interface GetParams extends GetEndpointParams, GetQueryParams {}

export function getSiteBlockSlugValidationQueryKey({
  siteId,
  pageId,
  ...params
}: Partial<GetParams>) {
  return getQueryKey(
    `/sites/${siteId}/pages/${pageId}/blocks/slug-duplication`,
    params
  );
}

export async function getSiteBlockSlugValidation(args: {
  params: GetParams;
  request?: Request;
}) {
  const {
    params: { siteId, pageId, slug },
    request,
  } = args;
  const axios = createAxiosInstance(request);
  const queryString = qs.stringify({ slug }, { addQueryPrefix: true });
  return await axios.get<boolean, AxiosResponse<boolean, GetParams>, GetParams>(
    `/sites/${siteId}/pages/${pageId}/blocks/slug-duplication${queryString}`
  );
}
