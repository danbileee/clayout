-- 20250922_cleanup_indexes.sql

-- Drop leftover indexes that shouldn't exist
drop index if exists "public"."IDX_site_domains_siteId";
drop index if exists "public"."UQ_site_domains_one_primary_per_site";

-- Ensure site_blocks has the proper unique constraint on slug
DO $$
BEGIN
  -- Create the index if it doesn't already exist
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'UQ_site_blocks_slug'
  ) THEN
    CREATE UNIQUE INDEX "UQ_site_blocks_slug" ON public.site_blocks USING btree (slug);
  END IF;

  -- Attach the index to the constraint if not already set
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'UQ_site_blocks_slug'
  ) THEN
    ALTER TABLE "public"."site_blocks"
      ADD CONSTRAINT "UQ_site_blocks_slug" UNIQUE USING INDEX "UQ_site_blocks_slug";
  END IF;
END $$;
