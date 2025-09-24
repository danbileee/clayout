alter table "public"."site_blocks" drop constraint "UQ_site_blocks_slug";

drop index if exists "public"."UQ_site_blocks_slug";

CREATE INDEX "IDX_site_domains_siteId" ON public.site_domains USING btree ("siteId");

CREATE UNIQUE INDEX "UQ_site_domains_one_primary_per_site" ON public.site_domains USING btree ("siteId") WHERE ("isPrimary" = true);

-- Set block order per page based on creation time (0-indexed)
WITH ranked AS (
  SELECT
    id,
    ROW_NUMBER() OVER (PARTITION BY "pageId" ORDER BY "createdAt" ASC, id ASC) - 1 AS rn
  FROM public.site_blocks
)
UPDATE public.site_blocks sb
SET "order" = r.rn
FROM ranked r
WHERE sb.id = r.id;