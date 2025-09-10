-- Migration: Release Editor Layout
-- This migration adds data snapshot functionality and improves unique constraints

-- 1. Drop the old auto-generated index for site_releases version constraint
-- This index was created in 20250830000000_release_user_site.sql and is being replaced
-- with a better-named constraint
drop index if exists "public"."IDX_48b84660522d2428ca6d23119c";

-- 2. Add dataSnapshot column to store release data as JSONB
-- First add the column as nullable, then update existing records, then make it NOT NULL
alter table "public"."site_releases" add column "dataSnapshot" jsonb;
update "public"."site_releases" set "dataSnapshot" = '{}' where "dataSnapshot" is null;
alter table "public"."site_releases" alter column "dataSnapshot" set not null;

-- 3. Create unique constraint for site_blocks slug per page
-- This ensures each page can only have one block with a given slug
CREATE UNIQUE INDEX "UQ_site_blocks_slug_per_page" ON public.site_blocks USING btree ("pageId", slug);

-- 4. Create unique constraint for site_releases version per site
-- This replaces the old IDX_48b84660522d2428ca6d23119c index with a descriptive name
-- Ensures each site can only have one release with a given version number
CREATE UNIQUE INDEX "UQ_site_releases_version_per_site" ON public.site_releases USING btree ("siteId", version);