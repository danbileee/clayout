import { useParams } from "react-router";

export function useParamsId(): number {
  const params = useParams();

  if (!params) {
    return 0;
  }

  return params?.id ? parseInt(params.id, 10) : 0;
}
