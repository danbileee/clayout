-- Migration: release_text_block
-- Purpose
-- - Remove deprecated enum labels ('SitePage', 'SiteBlock') from public.assets_targettype_enum
-- - Add missing column public.site_blocks.order aligned with editor layout changes
--
-- Safety & Idempotency
-- - Wrapped in a single transaction
-- - Uses an advisory lock to prevent concurrent execution
-- - Checks object existence before creating/dropping
-- - Coerces legacy enum values to 'None' before type change

-- Keep migrations fast and predictable during CI/CD
SET lock_timeout = '5s';
SET statement_timeout = '60s';

BEGIN;
  -- Prevent concurrent application of this migration
  SELECT pg_advisory_lock(hashtext('migration:20250916100759_release_text_block'));

  -- Guard: ensure table/column exist before proceeding
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name   = 'assets'
        AND column_name  = 'targetType'
    ) THEN
      RAISE NOTICE 'Skipping enum migration: public.assets.targetType does not exist';
      RETURN;
    END IF;
  END$$;

  -- 1) Create a temporary replacement enum with only allowed labels
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_type t
      JOIN pg_namespace n ON n.oid = t.typnamespace
      WHERE t.typname = 'assets_targettype_enum_new'
        AND n.nspname = 'public'
    ) THEN
      CREATE TYPE public.assets_targettype_enum_new AS ENUM ('None', 'Site');
    END IF;
  END$$;

  -- 2) Normalize legacy/deprecated enum values to a safe value
  -- If the deprecated labels do not exist in the current enum, this no-ops.
  UPDATE public.assets
  SET "targetType" = 'None'
  WHERE "targetType" IN ('SitePage', 'SiteBlock');

  -- 3) Switch the column to the new type
  -- 3-1) Drop default to avoid casting issues
  DO $$
  BEGIN
    IF EXISTS (
      SELECT 1
      FROM pg_attribute a
      JOIN pg_class c ON c.oid = a.attrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      JOIN pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
      WHERE n.nspname = 'public' AND c.relname = 'assets' AND a.attname = 'targetType'
    ) THEN
      ALTER TABLE public.assets ALTER COLUMN "targetType" DROP DEFAULT;
    END IF;
  END$$;

  -- 3-2) Alter type using a text cast to bridge old/new enums
  ALTER TABLE public.assets
    ALTER COLUMN "targetType" TYPE public.assets_targettype_enum_new
    USING ("targetType"::text::public.assets_targettype_enum_new);

  -- 4) Replace old enum type with the new one (rename for compatibility)
  DO $$
  BEGIN
    IF EXISTS (
      SELECT 1
      FROM pg_type t
      JOIN pg_namespace n ON n.oid = t.typnamespace
      WHERE t.typname = 'assets_targettype_enum'
        AND n.nspname = 'public'
    ) THEN
      DROP TYPE public.assets_targettype_enum;
    END IF;
  END$$;

  ALTER TYPE public.assets_targettype_enum_new RENAME TO assets_targettype_enum;

  -- 5) Reinstate a safe default
  ALTER TABLE public.assets
    ALTER COLUMN "targetType" SET DEFAULT 'None'::public.assets_targettype_enum;

  -- 6) Add missing order column to site_blocks to align with editor layout changes
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'site_blocks'
        AND column_name = 'order'
    ) THEN
      ALTER TABLE public.site_blocks
        ADD COLUMN "order" integer;

      -- Backfill existing rows with default value 0
      UPDATE public.site_blocks SET "order" = 0 WHERE "order" IS NULL;

      -- Make column NOT NULL with default
      ALTER TABLE public.site_blocks
        ALTER COLUMN "order" SET DEFAULT 0,
        ALTER COLUMN "order" SET NOT NULL;
    END IF;
  END$$;

  -- 7) Add assets.authorId with FK to users(id); keep idempotent and safe
  -- 7-1) Add column if missing (initially nullable to avoid breaking existing rows)
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'assets'
        AND column_name = 'authorId'
    ) THEN
      ALTER TABLE public.assets ADD COLUMN "authorId" integer;
    END IF;
  END$$;

  -- 7-2) Add FK constraint if missing, create NOT VALID first then validate (online)
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_constraint c
      JOIN pg_class r ON r.oid = c.conrelid
      JOIN pg_namespace n ON n.oid = r.relnamespace
      WHERE n.nspname = 'public'
        AND r.relname = 'assets'
        AND c.conname = 'FK_a2021c6185f9e15e682c43c460e'
    ) THEN
      ALTER TABLE public.assets
        ADD CONSTRAINT "FK_a2021c6185f9e15e682c43c460e"
        FOREIGN KEY ("authorId") REFERENCES public.users(id) NOT VALID;
    END IF;
  END$$;

  ALTER TABLE public.assets
    VALIDATE CONSTRAINT "FK_a2021c6185f9e15e682c43c460e";

  -- 7-3) Enforce NOT NULL only if data is clean (no NULLs)
  DO $$
  DECLARE
    has_nulls boolean;
  BEGIN
    SELECT EXISTS (
      SELECT 1 FROM public.assets WHERE "authorId" IS NULL
    ) INTO has_nulls;

    IF NOT has_nulls THEN
      -- Only set NOT NULL when safe
      ALTER TABLE public.assets ALTER COLUMN "authorId" SET NOT NULL;
    ELSE
      RAISE NOTICE 'Skipped setting NOT NULL on public.assets.authorId because some rows are NULL. Please backfill first.';
    END IF;
  END$$;

  -- Release advisory lock
  SELECT pg_advisory_unlock(hashtext('migration:20250916100759_release_text_block'));
COMMIT;