import { getAuthUser, getAuthUserKey } from "@/apis/auth/user";
import { defaultQueryClient } from "../react-query/QuernClientProvider";

export async function isAuthenticated(): Promise<boolean> {
  const response = await defaultQueryClient.ensureQueryData({
    queryKey: getAuthUserKey(),
    queryFn: () => getAuthUser(),
  });

  return Boolean(response?.data?.user);
}
