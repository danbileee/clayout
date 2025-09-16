import * as Typo from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { useUploadAssets } from "@/hooks/useUploadAssets";
import {
  AssetTargetTypes,
  PaginationOptions,
  type Tables,
} from "@clayout/interface";
import { getAssets, getAssetsQueryKey } from "@/apis/assets";
import { useInfiniteQuery } from "@tanstack/react-query";
import { handleError } from "@/lib/axios/handleError";
import { Empty } from "../../placeholder/empty";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { IconCloudUp } from "@tabler/icons-react";
import {
  DynamicGridBox,
  HFlexBox,
  ScrollBox,
  VFlexBox,
} from "@/components/ui/box";
import { rem } from "@/utils/rem";
import { styled, css } from "styled-components";
import type { Props } from "./types";

const baseQueryKey: Omit<PaginationOptions<Tables<"assets">>, "from"> = {
  take: 20,
  sort: [
    {
      property: "createdAt",
      direction: "asc",
    },
  ],
  filter: [
    {
      property: "targetType",
      contains: [AssetTargetTypes.Site],
    },
  ],
};

export function Manual({
  onChange,
  options,
}: Pick<Props, "onChange" | "options">) {
  const { createAssetDto } = options ?? {};
  const { inputRef, handleButtonClick, handleUploadAssets } = useUploadAssets({
    params: createAssetDto,
  });
  const { data } = useInfiniteQuery({
    queryKey: getAssetsQueryKey(baseQueryKey),
    queryFn: async ({ pageParam }) => {
      const fn = async () =>
        await getAssets({
          params: {
            ...baseQueryKey,
            from: pageParam,
          },
        });

      try {
        return await fn();
      } catch (e) {
        const { error, data } = await handleError(e, {
          onRetry: fn,
        });

        if (error) {
          throw error;
        }

        return data;
      }
    },
    getNextPageParam: (lastGroup) =>
      lastGroup?.data?.results?.cursor?.after ?? undefined,
    initialPageParam: 0,
  });
  const assets = useMemo(
    () => data?.pages.flatMap((d) => d?.data?.results?.data ?? []) ?? [],
    [data?.pages]
  );

  return (
    <>
      <ManualOptions gap={8}>
        <Button
          startIcon={<Icon>{IconCloudUp}</Icon>}
          onClick={handleButtonClick}
        >
          Upload file
        </Button>
        <input
          ref={inputRef}
          hidden
          type="file"
          accept="image/*"
          onChange={handleUploadAssets}
        />
        <Typo.Small>or</Typo.Small>
        <HFlexBox gap={6}>
          <Input id="upload-image-url" placeholder="Enter the image URL" />
          <Button>Submit</Button>
        </HFlexBox>
      </ManualOptions>
      <VFlexBox gap={20}>
        <Typo.P weight="medium">Recently uploaded</Typo.P>
        <ScrollBox padding={20} style={{ height: rem(400) }}>
          {assets.length > 0 ? (
            <DynamicGridBox
              variant="filled"
              cardWidth={{
                min: 125,
                max: 150,
              }}
            >
              {assets.map((asset) =>
                asset ? (
                  <ImageCard
                    key={asset.id}
                    backgroundImage={`${import.meta.env.VITE_ASSETS_HOST}/${
                      asset.path
                    }`}
                  ></ImageCard>
                ) : null
              )}
            </DynamicGridBox>
          ) : (
            <Empty>
              {`No images yet\nUpload a file or paste an image URL to get started!`}
            </Empty>
          )}
        </ScrollBox>
      </VFlexBox>
    </>
  );
}

const ManualOptions = styled(HFlexBox)`
  position: absolute;
  top: ${rem(58)};
  right: ${rem(24)};
`;

interface ImageCardProps {
  backgroundImage: string;
}

const ImageCard = styled.div.withConfig({
  shouldForwardProp: (prop) => {
    const nonForwardedProps = ["backgroundImage"];

    return !nonForwardedProps.includes(prop);
  },
})<ImageCardProps>`
  ${({ backgroundImage }) => css`
    width: 100%;
    aspect-ratio: 1 / 1;
    background-image: ${backgroundImage};
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  `}
`;
