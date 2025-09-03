-- Migration to add missing columns and update enums after the release_user_site migration
-- This migration addresses missing database schema elements found in TypeORM entities

-- 1. Create missing enum type for site_domains status (if not exists)
DO $$ BEGIN
    CREATE TYPE "public"."site_domains_status_enum" AS ENUM ('Pending', 'Verified', 'Error');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Update asset_types_enum to include 'None' value (missing from release_user_site)
ALTER TYPE "public"."asset_types_enum" ADD VALUE IF NOT EXISTS 'None';

-- 3. Add missing columns to site_pages table
ALTER TABLE public.site_pages ADD COLUMN IF NOT EXISTS "order" integer NOT NULL DEFAULT 0;
ALTER TABLE public.site_pages ADD COLUMN IF NOT EXISTS "isHome" boolean NOT NULL DEFAULT false;
ALTER TABLE public.site_pages ADD COLUMN IF NOT EXISTS "isVisible" boolean NOT NULL DEFAULT true;

-- 4. Add missing columns to site_domains table
ALTER TABLE public.site_domains ADD COLUMN IF NOT EXISTS "status" site_domains_status_enum NOT NULL DEFAULT 'Pending'::site_domains_status_enum;
ALTER TABLE public.site_domains ADD COLUMN IF NOT EXISTS "isPrimary" boolean NOT NULL DEFAULT false;
ALTER TABLE public.site_domains ADD COLUMN IF NOT EXISTS "redirectToDomainId" integer;

-- 5. Remove the old isVerified column from site_domains (replaced by status enum)
ALTER TABLE public.site_domains DROP COLUMN IF EXISTS "isVerified";

-- 6. Add self-referencing foreign key for site_domains redirectToDomainId
DO $$ BEGIN
    ALTER TABLE public.site_domains ADD CONSTRAINT "FK_1375e0adf1ad0f43fc91b2c064b" 
        FOREIGN KEY ("redirectToDomainId") REFERENCES site_domains(id) ON DELETE SET NULL NOT VALID;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
ALTER TABLE public.site_domains VALIDATE CONSTRAINT "FK_1375e0adf1ad0f43fc91b2c064b";

-- 7. Grant permissions for the new enum type
GRANT USAGE ON TYPE "public"."site_domains_status_enum" TO "anon";
GRANT USAGE ON TYPE "public"."site_domains_status_enum" TO "authenticated";
GRANT USAGE ON TYPE "public"."site_domains_status_enum" TO "service_role";

