-- Fix: Remove global unique constraint on site_blocks.slug that conflicts with undo/redo
-- This migration safely removes the global constraint while preserving the per-page constraint
-- Safe for production as it only removes constraints, doesn't modify data

-- First, check if the global constraint exists and remove it
DO $$
BEGIN
  -- Drop the global unique constraint if it exists
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'UQ_site_blocks_slug' 
    AND conrelid = 'public.site_blocks'::regclass
  ) THEN
    ALTER TABLE public.site_blocks DROP CONSTRAINT "UQ_site_blocks_slug";
  END IF;
  
  -- Drop the global unique index if it exists
  IF EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'site_blocks' 
    AND indexname = 'UQ_site_blocks_slug'
  ) THEN
    DROP INDEX IF EXISTS "public"."UQ_site_blocks_slug";
  END IF;
END $$;

-- Ensure the per-page constraint exists (should already exist from previous migration)
-- This is idempotent - won't create if it already exists
CREATE UNIQUE INDEX IF NOT EXISTS "UQ_site_blocks_slug_per_page" 
ON public.site_blocks USING btree ("pageId", slug);
