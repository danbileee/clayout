import { useTheme } from "styled-components";
import { IconPhotoPlus, IconSearch } from "@tabler/icons-react";
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
import { useInfiniteQuery } from "@tanstack/react-query";
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

export function Search({ onChange }: Pick<Props, "onChange">) {
  const theme = useTheme();
  const [query, setQuery] = useState("wallpaper");
  const { data, isFetching } = useInfiniteQuery({
    queryKey: getPexelsSearchQueryKey({ query }),
    queryFn: async ({ pageParam = 1 }) => {
      const res = await getPexelsSearch({
        params: { query, page: pageParam, per_page: 80 },
      });
      return res.data;
    },
    getNextPageParam: (lastGroup) =>
      "error" in lastGroup ? undefined : lastGroup.page + 1,
    initialPageParam: 1,
  });
  const photos = useMemo(
    () =>
      data?.pages.flatMap((page) =>
        "error" in page ? [] : page?.photos ?? []
      ) ?? [],
    [data?.pages]
  );
  const isError = useMemo(
    () => Boolean(data?.pages.flat().filter((page) => "error" in page).length),
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
          {isFetching && <LoadingPlaceholder />}
          {!isFetching && !photos.length && (
            <EmptyPlaceholder>{`No results yet\nTry another keyword — we'll find something lovely!`}</EmptyPlaceholder>
          )}
          {!isFetching && isError && (
            <ErrorPlaceholder>{`Something is wrong\nPlease try again after a moment.`}</ErrorPlaceholder>
          )}
          {!isFetching && !isError && photos.length > 0 && (
            <DynamicGridBox
              variant="filled"
              cardWidth={{
                min: 125,
                max: 150,
              }}
            >
              {photos.map((photo) => (
                <ImageCardWrapper>
                  <ImageCard
                    key={photo.id}
                    src={photo.src.tiny}
                    alt={photo.alt ?? ""}
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
