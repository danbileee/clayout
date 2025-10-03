-- Keep migrations fast and predictable during CI/CD
SET lock_timeout = '5s';
SET statement_timeout = '60s';

BEGIN;
  -- Prevent concurrent application of this migration
  SELECT pg_advisory_lock(hashtext('migration:20251001123134_release_page_props'));

  -- Add containerStyle column to site_pages if it doesn't exist
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'site_pages'
        AND column_name = 'containerStyle'
    ) THEN
      ALTER TABLE public.site_pages
        ADD COLUMN "containerStyle" jsonb;

      RAISE NOTICE 'Added containerStyle column to public.site_pages';
    ELSE
      RAISE NOTICE 'Column public.site_pages.containerStyle already exists, skipping';
    END IF;
  END$$;

  -- Backfill existing NULL values with empty object for containerStyle
  DO $$
  DECLARE
    updated_count integer;
  BEGIN
    UPDATE public.site_pages
    SET "containerStyle" = '{}'::jsonb
    WHERE "containerStyle" IS NULL;

    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RAISE NOTICE 'Backfilled % NULL containerStyle values with empty object', updated_count;
  END$$;

  -- Reset all existing meta properties to empty object
  DO $$
  DECLARE
    updated_count integer;
  BEGIN
    -- Reset all meta values to empty object
    UPDATE public.site_pages
    SET "meta" = '{}'::jsonb;

    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RAISE NOTICE 'Reset % site_pages meta properties to empty object', updated_count;
  END$$;

  -- Release advisory lock
  SELECT pg_advisory_unlock(hashtext('migration:20251001123134_release_page_props'));
COMMIT;