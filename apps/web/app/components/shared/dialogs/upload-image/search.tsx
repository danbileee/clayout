import { useTheme } from "styled-components";
import { IconPhotoPlus, IconSearch } from "@tabler/icons-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import * as Tooltip from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { rem } from "@/utils/rem";
import {
  DynamicGridBox,
  HFlexBox,
  ScrollBox,
  VFlexBox,
} from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { EmptyPlaceholder } from "@/components/shared/placeholder/empty";
import { LoadingPlaceholder } from "@/components/shared/placeholder/loading";
import { ErrorPlaceholder } from "@/components/shared/placeholder/error";
import { getPexelsSearch, getPexelsSearchQueryKey } from "@/apis/pexels/search";
import { useMemo, useState, type ChangeEvent } from "react";
import debounce from "lodash/debounce";
import {
  ButtonsWrapper,
  ImageCard,
  ImageCardWrapper,
  InputsWrapper,
} from "./styled";
import type { Props } from "./types";
import { handleError } from "@/lib/axios/handleError";
import { Observer } from "@/components/shared/observer";
import { toast } from "sonner";

export function Search({ onChange }: Pick<Props, "onChange">) {
  const theme = useTheme();
  const [query, setQuery] = useState("wallpaper");
  const { data, isFetching, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: getPexelsSearchQueryKey({ query }),
      queryFn: async ({ pageParam }) => {
        const fn = async () =>
          await getPexelsSearch({
            params: { query, page: pageParam, per_page: 80 },
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
      getNextPageParam: (lastGroup) => {
        if (!lastGroup?.data) {
          return undefined;
        }

        if ("error" in lastGroup.data) {
          return undefined;
        }

        /**
         * Don't `return lastGroup.data.next_page` directly.
         * This conditional logic is necessary
         * because the `next_page` is actually string type data
         * that contains full URL for API request
         */
        return lastGroup.data.next_page ? lastGroup.data.page + 1 : undefined;
      },
      initialPageParam: 1,
    });
  const photos = useMemo(
    () =>
      data?.pages.flatMap((page) => {
        if (page?.data) {
          return "error" in page.data ? [] : page.data.photos;
        }
        return [];
      }) ?? [],
    [data?.pages]
  );
  const isError = useMemo(
    () =>
      Boolean(
        data?.pages
          .flat()
          .filter((page) => page && "data" in page && "error" in page.data)
          .length
      ),
    [data?.pages]
  );

  const handleChangeQuery = debounce((e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, 500);

  return (
    <>
      <InputsWrapper gap={6}>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Button isSquare size="sm" variant="ghost">
              <Icon color={theme.colors.slate[500]}>{IconSearch}</Icon>
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>{`Need ideas? Try keywords like\nwallpaper, background, or pattern to get started.`}</Tooltip.Content>
        </Tooltip.Root>
        <div style={{ width: rem(200) }}>
          <Input
            id="search-image-keyword"
            placeholder="Enter a search keyword"
            onChange={handleChangeQuery}
          />
        </div>
      </InputsWrapper>
      <VFlexBox gap={20}>
        <ScrollBox padding={20} style={{ height: rem(400) }}>
          {isFetching && !photos.length && <LoadingPlaceholder />}
          {!isFetching && !isFetchingNextPage && isError && (
            <ErrorPlaceholder>{`Something went wrong\nPlease try again after a moment.`}</ErrorPlaceholder>
          )}
          {!isFetching && !photos.length && (
            <EmptyPlaceholder>{`No results yet\nTry another keyword — we'll find something lovely!`}</EmptyPlaceholder>
          )}
          {!isError && photos.length > 0 && (
            <>
              <DynamicGridBox
                variant="filled"
                cardWidth={{
                  min: 125,
                  max: 150,
                }}
              >
                {photos.map((photo) => (
                  <ImageCardWrapper key={photo.id}>
                    <ImageCard
                      src={photo.src.tiny}
                      alt={photo.alt ?? ""}
                      loading="lazy"
                    />
                    <ButtonsWrapper gap={8}>
                      <Tooltip.Root>
                        <Tooltip.Trigger>
                          <Button
                            isSquare
                            size="sm"
                            onClick={() => onChange(photo.src.large)}
                          >
                            <Icon size={14}>{IconPhotoPlus}</Icon>
                          </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content>{`Apply this image\n(Photo by ${photo.photographer})`}</Tooltip.Content>
                      </Tooltip.Root>
                    </ButtonsWrapper>
                  </ImageCardWrapper>
                ))}
              </DynamicGridBox>
              <Observer
                onObserve={(isIntersecting) => {
                  if (isIntersecting) {
                    toast.promise(fetchNextPage, {
                      loading: "Fetching more images...",
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
        <HFlexBox justifyContent="flex-end">
          <a
            href="https://www.pexels.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: rem(14), color: theme.colors.slate[400] }}
          >
            Photos provided by{" "}
            <span className="underline underline-offset-4">Pexels</span>
          </a>
        </HFlexBox>
      </VFlexBox>
    </>
  );
}
