import { useRef, type ChangeEvent, type RefObject } from "react";
import { useClientMutation } from "@/lib/react-query/useClientMutation";
import { getAssetSignedUrl, postAssets, uploadFile } from "@/apis/assets";
import { handleError } from "@/lib/axios/handleError";

interface Params {
  params: Awaited<ReturnType<typeof postAssets>>["config"]["data"];
}

interface Returns {
  inputRef: RefObject<HTMLInputElement | null>;
  handleButtonClick: VoidFunction;
  handleUploadAssets: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export function useUploadAssets({ params }: Params): Returns {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: createAsset } = useClientMutation({
    mutationFn: postAssets,
  });

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleUploadAssets = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (!files || !files.length) return;

    const [file] = Array.from(files);

    const fn = async () => {
      const assetKey = `${params?.path}/${file.name}`;
      const {
        data: { signedUrl },
      } = await getAssetSignedUrl({
        params: { key: assetKey, contentType: file.type },
      });
      await uploadFile(signedUrl, file);
      await createAsset({
        params: {
          ...params,
          path: assetKey,
        },
      });
    };

    try {
      await fn();
    } catch (e) {
      const { error } = await handleError(e, {
        onRetry: fn,
      });

      if (error) {
        throw error;
      }
    }
  };

  return {
    inputRef,
    handleButtonClick,
    handleUploadAssets,
  };
}
