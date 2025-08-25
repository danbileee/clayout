import { styled } from "styled-components";
import { BLOCKBAR_WIDTH, MENU_WIDTH, SIDEBAR_WIDTH } from "./constants";
import { Button } from "@/components/ui/button";
import { rem } from "@/utils/rem";
import { useRef, type ChangeEvent } from "react";
import { useClientMutation } from "@/lib/react-query/useClientMutation";
import { getAssetSignedUrl, postAssets, uploadFile } from "@/apis/assets";
import { handleError } from "@/lib/axios/handleError";
import { useSiteContext } from "../contexts/site.context";
import { AssetTypes } from "@clayout/interface";

export function EditorSidebar() {
  const { site } = useSiteContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: createAsset } = useClientMutation({
    mutationFn: postAssets,
  });

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (!files) return;

    const [file] = Array.from(files);

    const fn = async () => {
      const assetKey = `sites/${site.id}/${file.name}`;
      const {
        data: { signedUrl },
      } = await getAssetSignedUrl({
        params: { key: assetKey, contentType: file.type },
      });
      await uploadFile(signedUrl, file);
      await createAsset({
        params: {
          targetId: site.id,
          targetType: AssetTypes.Site,
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

  return (
    <Aside>
      <Menu>
        <Button onClick={handleClick}>Upload Image</Button>
        <input
          type="file"
          hidden
          onChange={handleUploadImage}
          ref={fileInputRef}
        />
      </Menu>
      <Blockbar>
        <Buttons>
          <Button>Text</Button>
          <Button>Image</Button>
          <Button>Button</Button>
        </Buttons>
      </Blockbar>
    </Aside>
  );
}

const Aside = styled.aside`
  display: flex;
  width: ${rem(SIDEBAR_WIDTH)};
  height: 100svh;
`;

const Menu = styled.div`
  width: ${rem(MENU_WIDTH)};
`;

const Blockbar = styled.div`
  width: ${rem(BLOCKBAR_WIDTH)};
  padding: ${rem(20)};
`;

const Buttons = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${rem(20)};
`;
