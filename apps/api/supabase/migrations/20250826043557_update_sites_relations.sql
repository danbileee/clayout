-- Add foreign key constraints for assets table to ensure referential integrity
-- Note: We cannot use conditional foreign keys with WHERE clauses in PostgreSQL
-- Instead, we'll rely on application-level validation for the target_type enum

-- Add index for better performance on asset lookups by target
CREATE INDEX "IDX_assets_target_type_id" ON public.assets USING btree ("target_type", "target_id");

-- Add unique constraint to prevent duplicate assets for the same target
CREATE UNIQUE INDEX "UQ_assets_target_path" ON public.assets USING btree ("target_type", "target_id", "path");
ALTER TABLE "public"."assets" ADD CONSTRAINT "UQ_assets_target_path" UNIQUE USING INDEX "UQ_assets_target_path";

-- Add missing foreign key constraints for sites relations
-- Note: Most foreign key constraints are already defined in the original sites migration
-- These are additional constraints or improvements that might be needed

-- Add foreign key constraint for site_pages to sites (if not already present)
-- This ensures site_pages.siteId references sites.id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'FK_site_pages_site' 
        AND table_name = 'site_pages'
    ) THEN
        ALTER TABLE "public"."site_pages" 
        ADD CONSTRAINT "FK_site_pages_site" 
        FOREIGN KEY ("siteId") REFERENCES sites(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key constraint for site_blocks to site_pages (if not already present)
-- This ensures site_blocks.pageId references site_pages.id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'FK_site_blocks_page' 
        AND table_name = 'site_blocks'
    ) THEN
        ALTER TABLE "public"."site_blocks" 
        ADD CONSTRAINT "FK_site_blocks_page" 
        FOREIGN KEY ("pageId") REFERENCES site_pages(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key constraint for site_blocks to sites (if not already present)
-- This ensures site_blocks.siteId references sites.id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'FK_site_blocks_site' 
        AND table_name = 'site_blocks'
    ) THEN
        ALTER TABLE "public"."site_blocks" 
        ADD CONSTRAINT "FK_site_blocks_site" 
        FOREIGN KEY ("siteId") REFERENCES sites(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key constraint for site_domains to sites (if not already present)
-- This ensures site_domains.siteId references sites.id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'FK_site_domains_site' 
        AND table_name = 'site_domains'
    ) THEN
        ALTER TABLE "public"."site_domains" 
        ADD CONSTRAINT "FK_site_domains_site" 
        FOREIGN KEY ("siteId") REFERENCES sites(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key constraint for site_releases to sites (if not already present)
-- This ensures site_releases.siteId references sites.id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'FK_site_releases_site' 
        AND table_name = 'site_releases'
    ) THEN
        ALTER TABLE "public"."site_releases" 
        ADD CONSTRAINT "FK_site_releases_site" 
        FOREIGN KEY ("siteId") REFERENCES sites(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add additional indexes for better performance on common queries
CREATE INDEX IF NOT EXISTS "IDX_site_pages_site_id" ON public.site_pages USING btree ("siteId");
CREATE INDEX IF NOT EXISTS "IDX_site_blocks_page_id" ON public.site_blocks USING btree ("pageId");
CREATE INDEX IF NOT EXISTS "IDX_site_blocks_site_id" ON public.site_blocks USING btree ("siteId");
CREATE INDEX IF NOT EXISTS "IDX_site_domains_site_id" ON public.site_domains USING btree ("siteId");
CREATE INDEX IF NOT EXISTS "IDX_site_releases_site_id" ON public.site_releases USING btree ("siteId");

-- Fix column type mismatch: Change site_releases.version from integer to character varying
-- This aligns the database schema with the TypeORM entity which expects a string
ALTER TABLE "public"."site_releases" 
ALTER COLUMN "version" TYPE character varying;

-- Drop and recreate the unique constraint since the column type changed
-- The original constraint was on (siteId, version) where version was integer
ALTER TABLE "public"."site_releases" DROP CONSTRAINT IF EXISTS "UQ_site_releases_site_version";
DROP INDEX IF EXISTS "UQ_site_releases_site_version";
CREATE UNIQUE INDEX "UQ_site_releases_site_version" ON public.site_releases USING btree ("siteId", "version");
ALTER TABLE "public"."site_releases" ADD CONSTRAINT "UQ_site_releases_site_version" UNIQUE USING INDEX "UQ_site_releases_site_version";
