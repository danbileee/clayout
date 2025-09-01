-- Migration to fix site_pages slug constraint and add missing database changes
-- This migration addresses issues found after the release_user_site migration

-- 1. Create missing enum type for site_domains status
CREATE TYPE "public"."site_domains_status_enum" AS ENUM ('Pending', 'Verified', 'Error');

-- 2. Add missing columns to site_pages table
ALTER TABLE public.site_pages ADD COLUMN IF NOT EXISTS "order" integer NOT NULL DEFAULT 0;
ALTER TABLE public.site_pages ADD COLUMN IF NOT EXISTS "isHome" boolean NOT NULL DEFAULT false;
ALTER TABLE public.site_pages ADD COLUMN IF NOT EXISTS "isVisible" boolean NOT NULL DEFAULT true;

-- 3. Add missing columns to site_domains table
ALTER TABLE public.site_domains ADD COLUMN IF NOT EXISTS "status" site_domains_status_enum NOT NULL DEFAULT 'Pending'::site_domains_status_enum;
ALTER TABLE public.site_domains ADD COLUMN IF NOT EXISTS "isPrimary" boolean NOT NULL DEFAULT false;
ALTER TABLE public.site_domains ADD COLUMN IF NOT EXISTS "redirectToDomainId" integer;

-- 4. Remove the existing global unique constraint on site_pages slug
ALTER TABLE public.site_pages DROP CONSTRAINT IF EXISTS "UQ_site_pages_slug";
DROP INDEX IF EXISTS "UQ_site_pages_slug";

-- 5. Create composite unique constraint for site_pages (siteId + slug)
-- This ensures slug is unique within each site, but allows duplicates across different sites
CREATE UNIQUE INDEX "UQ_site_pages_slug_per_site" ON public.site_pages USING btree ("siteId", slug);
ALTER TABLE public.site_pages ADD CONSTRAINT "UQ_site_pages_slug_per_site" UNIQUE USING INDEX "UQ_site_pages_slug_per_site";

-- 6. Add self-referencing foreign key for site_domains redirectToDomainId
ALTER TABLE public.site_domains ADD CONSTRAINT "FK_1375e0adf1ad0f43fc91b2c064b" 
    FOREIGN KEY ("redirectToDomainId") REFERENCES site_domains(id) ON DELETE SET NULL NOT VALID;
ALTER TABLE public.site_domains VALIDATE CONSTRAINT "FK_1375e0adf1ad0f43fc91b2c064b";

-- 7. Update site_blocks unique constraint to be per-page instead of global
-- Remove existing global unique constraint
ALTER TABLE public.site_blocks DROP CONSTRAINT IF EXISTS "UQ_site_blocks_slug";
DROP INDEX IF EXISTS "UQ_site_blocks_slug";

-- Create composite unique constraint for site_blocks (pageId + slug)
CREATE UNIQUE INDEX "UQ_site_blocks_slug_per_page" ON public.site_blocks USING btree ("pageId", slug);
ALTER TABLE public.site_blocks ADD CONSTRAINT "UQ_site_blocks_slug_per_page" UNIQUE USING INDEX "UQ_site_blocks_slug_per_page";

-- 8. Grant permissions for the new enum type
GRANT USAGE ON TYPE "public"."site_domains_status_enum" TO "anon";
GRANT USAGE ON TYPE "public"."site_domains_status_enum" TO "authenticated";
GRANT USAGE ON TYPE "public"."site_domains_status_enum" TO "service_role";
