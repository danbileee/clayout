import type { CreateAssetDto } from "@clayout/interface";

interface Options {
  createAssetDto: CreateAssetDto;
}

export interface Props {
  value: string;
  onChange: (value: string) => void;
  options?: Options;
}
