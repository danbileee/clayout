-- Modify assets_targettype_enum to remove SitePage and SiteBlock
-- 1) Create a new enum with the reduced set
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

-- 2) Coerce any existing rows using deprecated values to a safe value
UPDATE public.assets
SET "targetType" = 'None'
WHERE "targetType" IN ('SitePage', 'SiteBlock');

-- 3) Alter the column to use the new enum
-- 3-1) Drop default to avoid casting issues
ALTER TABLE public.assets
  ALTER COLUMN "targetType" DROP DEFAULT;

-- 3-2) Alter type to the new enum
ALTER TABLE public.assets
  ALTER COLUMN "targetType" TYPE public.assets_targettype_enum_new
  USING ("targetType"::text::public.assets_targettype_enum_new);

-- 4) Drop the old enum and rename the new one
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

-- 5) Set a safe default if needed
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


