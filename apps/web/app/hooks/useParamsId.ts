import { useParams } from "react-router";

export function useParamsId(): number {
  const params = useParams();

  return params?.id ? parseInt(params.id, 10) : 0;
}
