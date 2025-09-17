import * as Typo from "@/components/ui/typography";
import * as Tooltip from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { useUploadAssets } from "@/hooks/useUploadAssets";
import {
  AssetTargetTypes,
  PaginationOptions,
  type Tables,
} from "@clayout/interface";
import { deleteAssets, getAssets, getAssetsQueryKey } from "@/apis/assets";
import { useInfiniteQuery } from "@tanstack/react-query";
import { handleError } from "@/lib/axios/handleError";
import { Empty } from "../../placeholder/empty";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { IconCloudUp, IconPhotoPlus, IconTrash } from "@tabler/icons-react";
import {
  DynamicGridBox,
  HFlexBox,
  ScrollBox,
  VFlexBox,
} from "@/components/ui/box";
import { rem } from "@/utils/rem";
import { styled, css } from "styled-components";
import type { Props } from "./types";
import { useClientMutation } from "@/lib/react-query/useClientMutation";
import { useDialog } from "@/components/ui/dialog";
import { ConfirmDeleteDialog } from "../confirm/delete";
import { toast } from "sonner";

const baseQueryKey: Omit<PaginationOptions<Tables<"assets">>, "from"> = {
  take: 20,
  sort: [
    {
      property: "createdAt",
      direction: "desc",
    },
  ],
  filter: [
    {
      property: "targetType",
      contains: [AssetTargetTypes.Site],
    },
  ],
};

export function Manual({ value, onChange, options }: Props) {
  const { createAssetDto } = options ?? {};
  const { openDialog, closeDialog } = useDialog();
  const { inputRef, handleButtonClick, handleUploadAssets } = useUploadAssets({
    params: createAssetDto,
  });
  const { mutateAsync: deleteAsset, isPending: isDeleting } = useClientMutation(
    {
      mutationFn: deleteAssets,
    }
  );
  const { data, refetch: refetchAssets } = useInfiniteQuery({
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

  const handleDeleteAsset = async (asset: Tables<"assets">) => {
    const fn = async () => {
      await deleteAsset({
        params: { id: asset.id },
      });
      if (value.includes(asset.path)) {
        onChange("");
      }
      toast.success("Deleted the image.");
      await refetchAssets();
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

  const handleConfirmDelete = async (asset: Tables<"assets">) => {
    openDialog(
      <ConfirmDeleteDialog
        confirmButtonProps={{
          isLoading: isDeleting,
          onClick: () => {
            handleDeleteAsset(asset);
            closeDialog();
          },
        }}
      />
    );
  };

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
          onChange={(e) => handleUploadAssets(e, { onSuccess: refetchAssets })}
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
              {assets.map((asset) => {
                const backgroundImage = `${import.meta.env.VITE_ASSETS_HOST}/${
                  asset.path
                }`;
                return asset ? (
                  <ImageCard
                    key={asset.id}
                    backgroundImage={`"${backgroundImage}"`}
                  >
                    <ButtonsWrapper gap={8}>
                      <Tooltip.Root>
                        <Tooltip.Trigger>
                          <Button
                            isSquare
                            size="sm"
                            onClick={() => onChange(backgroundImage)}
                          >
                            <Icon size={14}>{IconPhotoPlus}</Icon>
                          </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content>Apply this image</Tooltip.Content>
                      </Tooltip.Root>
                      <Tooltip.Root>
                        <Tooltip.Trigger>
                          <Button
                            isSquare
                            size="sm"
                            level="secondary"
                            onClick={() => handleConfirmDelete(asset)}
                          >
                            <Icon size={14}>{IconTrash}</Icon>
                          </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                          Remove from recent uploads
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </ButtonsWrapper>
                  </ImageCard>
                ) : null;
              })}
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
  ${({ theme, backgroundImage }) => css`
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    background-color: ${theme.colors.slate[50]};
    border: 1px solid ${theme.colors.slate[200]};
    border-radius: ${rem(6)};

    ${backgroundImage &&
    css`
      background-image: url(${backgroundImage});
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    `}

    &:hover {
      &::after {
        background-color: rgba(255, 255, 255, 0.4);
      }
      > div {
        opacity: 1;
      }
    }

    &::after {
      position: absolute;
      display: block;
      content: "";
      width: 100%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: transparent;
      border-radius: ${rem(6)};
      z-index: 1;
      transition: background-color ease-in-out 200ms;
    }
  `}
`;

const ButtonsWrapper = styled(HFlexBox)`
  opacity: 0;
  position: absolute;
  top: ${rem(8)};
  right: ${rem(8)};
  transition: opacity ease-in-out 200ms;
  z-index: 2;
`;
