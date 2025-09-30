import * as Typo from "@/components/ui/typography";
import * as Tooltip from "@/components/ui/tooltip";
import { TextInput } from "@/components/ui/input";
import { useUploadAssets } from "@/hooks/useUploadAssets";
import {
  AssetTargetTypes,
  PaginationOptions,
  type Tables,
} from "@clayout/interface";
import { deleteAssets, getAssets, getAssetsQueryKey } from "@/apis/assets";
import { useInfiniteQuery } from "@tanstack/react-query";
import { handleError } from "@/lib/axios/handleError";
import { EmptyPlaceholder } from "@/components/shared/placeholder/empty";
import { LoadingPlaceholder } from "@/components/shared/placeholder/loading";
import { ErrorPlaceholder } from "@/components/shared/placeholder/error";
import { Observer } from "@/components/shared/observer";
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
import type { Props } from "./types";
import { useClientMutation } from "@/lib/react-query/useClientMutation";
import { useDialog } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ButtonsWrapper,
  ImageCard,
  ImageCardWrapper,
  InputsWrapper,
} from "./styled";
import { ConfirmDeleteDialog } from "../confirm/delete";

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
  const {
    data,
    refetch: refetchAssets,
    isFetching,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
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
    () => data?.pages.flatMap((page) => page?.data?.results?.data ?? []) ?? [],
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
      <InputsWrapper gap={8}>
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
          <TextInput id="upload-image-url" placeholder="Enter the image URL" />
          <Button>Submit</Button>
        </HFlexBox>
      </InputsWrapper>
      <VFlexBox gap={20}>
        <Typo.P weight="medium">Recently uploaded</Typo.P>
        <ScrollBox padding={20} style={{ height: rem(400) }}>
          {isFetching && !assets.length && <LoadingPlaceholder />}
          {!isFetching && !isFetchingNextPage && isError && (
            <ErrorPlaceholder>{`Something went wrong\nPlease try again after a moment.`}</ErrorPlaceholder>
          )}
          {!isFetching && !assets.length && (
            <EmptyPlaceholder>
              {`No images yet\nUpload a file or paste an image URL to get started!`}
            </EmptyPlaceholder>
          )}
          {!isError && assets.length > 0 && (
            <>
              <DynamicGridBox
                variant="filled"
                cardWidth={{
                  min: 125,
                  max: 150,
                }}
              >
                {assets.map((asset) => {
                  const backgroundImage = `${
                    import.meta.env.VITE_ASSETS_HOST
                  }/${asset.path}`;
                  return asset ? (
                    <ImageCardWrapper key={asset.id}>
                      <ImageCard src={backgroundImage} />
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
                    </ImageCardWrapper>
                  ) : null;
                })}
              </DynamicGridBox>
              <Observer
                onObserve={(isIntersecting) => {
                  if (isIntersecting) {
                    toast.promise(fetchNextPage, {
                      loading: "Fetching previous...",
                      success: "Fetched!",
                      error: "Failed to fetch",
                    });
                  }
                }}
                hidden={isFetchingNextPage || !hasNextPage}
              />
            </>
          )}
        </ScrollBox>
      </VFlexBox>
    </>
  );
}
