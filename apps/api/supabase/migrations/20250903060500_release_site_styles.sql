create type "public"."assets_targettype_enum" as enum ('None', 'Site', 'SitePage', 'SiteBlock');

alter table "public"."site_pages" drop constraint if exists "UQ_site_pages_slug";

drop index if exists "public"."UQ_site_pages_slug";

alter table "public"."assets" alter column "targetType" set data type assets_targettype_enum using "targetType"::text::assets_targettype_enum;

alter table "public"."assets" alter column "targetType" set default 'None'::assets_targettype_enum;

drop type "public"."asset_types_enum";

CREATE UNIQUE INDEX "UQ_site_pages_slug_per_site" ON public.site_pages USING btree ("siteId", slug);