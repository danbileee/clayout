-- Migration to update database schema to match TypeORM entity conventions
-- This migration creates missing tables and converts snake_case column names to camelCase

-- First, create missing enums and tables that were removed from previous migrations
-- Create enums for site-related entities
create type "public"."asset_types_enum" as enum ('Site', 'SitePage', 'SiteBlock');
create type "public"."sites_status_enum" as enum ('Draft', 'Published', 'Reviewing', 'Updating', 'Error');
create type "public"."sites_category_enum" as enum ('None', 'Blog', 'Landing Page', 'Newsletter', 'Portfolio', 'Hyperlink', 'Commerce');
create type "public"."site_pages_category_enum" as enum ('Static', 'List', 'Article');
create type "public"."site_blocks_type_enum" as enum ('None', 'Text', 'Image', 'Button');

-- Create sequences for auto-incrementing IDs
create sequence "public"."assets_id_seq";
create sequence "public"."site_blocks_id_seq";
create sequence "public"."site_domains_id_seq";
create sequence "public"."site_pages_id_seq";
create sequence "public"."site_releases_id_seq";
create sequence "public"."sites_id_seq";

-- Create assets table
create table "public"."assets" (
    "id" integer not null default nextval('assets_id_seq'::regclass),
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now(),
    "order" integer not null default 0,
    "targetType" asset_types_enum not null,
    "targetId" integer not null,
    "path" character varying not null
);

-- Create sites table
create table "public"."sites" (
    "id" integer not null default nextval('sites_id_seq'::regclass),
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now(),
    "slug" character varying not null,
    "name" character varying not null,
    "status" sites_status_enum not null default 'Draft'::sites_status_enum,
    "category" sites_category_enum not null default 'None'::sites_category_enum,
    "meta" jsonb,
    "lastPublishedAt" timestamp(6) with time zone,
    "lastPublishedVersion" character varying,
    "authorId" integer not null
);

-- Create site_pages table
create table "public"."site_pages" (
    "id" integer not null default nextval('site_pages_id_seq'::regclass),
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now(),
    "slug" character varying not null,
    "name" character varying not null,
    "category" site_pages_category_enum not null default 'Static'::site_pages_category_enum,
    "meta" jsonb,
    "siteId" integer not null
);

-- Create site_blocks table
create table "public"."site_blocks" (
    "id" integer not null default nextval('site_blocks_id_seq'::regclass),
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now(),
    "slug" character varying not null,
    "name" character varying not null,
    "type" site_blocks_type_enum not null default 'None'::site_blocks_type_enum,
    "data" jsonb,
    "style" jsonb,
    "containerStyle" jsonb,
    "pageId" integer not null,
    "siteId" integer not null
);

-- Create site_domains table
create table "public"."site_domains" (
    "id" integer not null default nextval('site_domains_id_seq'::regclass),
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now(),
    "hostname" character varying not null,
    "isVerified" boolean not null default false,
    "siteId" integer not null
);

-- Create site_releases table
create table "public"."site_releases" (
    "id" integer not null default nextval('site_releases_id_seq'::regclass),
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now(),
    "htmlSnapshot" text not null,
    "publishedAt" timestamp(6) with time zone,
    "version" character varying not null,
    "siteId" integer not null
);

-- Enable RLS on all new tables
alter table "public"."assets" enable row level security;
alter table "public"."sites" enable row level security;
alter table "public"."site_pages" enable row level security;
alter table "public"."site_blocks" enable row level security;
alter table "public"."site_domains" enable row level security;
alter table "public"."site_releases" enable row level security;

-- Set sequence ownership
alter sequence "public"."assets_id_seq" owned by "public"."assets"."id";
alter sequence "public"."site_blocks_id_seq" owned by "public"."site_blocks"."id";
alter sequence "public"."site_domains_id_seq" owned by "public"."site_domains"."id";
alter sequence "public"."site_pages_id_seq" owned by "public"."site_pages"."id";
alter sequence "public"."site_releases_id_seq" owned by "public"."site_releases"."id";
alter sequence "public"."sites_id_seq" owned by "public"."sites"."id";

-- Create primary key indexes
CREATE UNIQUE INDEX "PK_assets_id" ON public.assets USING btree (id);
CREATE UNIQUE INDEX "PK_sites_id" ON public.sites USING btree (id);
CREATE UNIQUE INDEX "PK_site_pages_id" ON public.site_pages USING btree (id);
CREATE UNIQUE INDEX "PK_site_blocks_id" ON public.site_blocks USING btree (id);
CREATE UNIQUE INDEX "PK_site_domains_id" ON public.site_domains USING btree (id);
CREATE UNIQUE INDEX "PK_site_releases_id" ON public.site_releases USING btree (id);

-- Create unique constraint indexes
CREATE UNIQUE INDEX "UQ_sites_slug" ON public.sites USING btree (slug);
CREATE UNIQUE INDEX "UQ_site_pages_slug" ON public.site_pages USING btree (slug);
CREATE UNIQUE INDEX "UQ_site_blocks_slug" ON public.site_blocks USING btree (slug);
CREATE UNIQUE INDEX "UQ_site_domains_hostname" ON public.site_domains USING btree (hostname);

-- Add primary key constraints
alter table "public"."assets" add constraint "PK_assets_id" PRIMARY KEY using index "PK_assets_id";
alter table "public"."sites" add constraint "PK_sites_id" PRIMARY KEY using index "PK_sites_id";
alter table "public"."site_pages" add constraint "PK_site_pages_id" PRIMARY KEY using index "PK_site_pages_id";
alter table "public"."site_blocks" add constraint "PK_site_blocks_id" PRIMARY KEY using index "PK_site_blocks_id";
alter table "public"."site_domains" add constraint "PK_site_domains_id" PRIMARY KEY using index "PK_site_domains_id";
alter table "public"."site_releases" add constraint "PK_site_releases_id" PRIMARY KEY using index "PK_site_releases_id";

-- Add unique constraints
alter table "public"."sites" add constraint "UQ_sites_slug" UNIQUE using index "UQ_sites_slug";
alter table "public"."site_pages" add constraint "UQ_site_pages_slug" UNIQUE using index "UQ_site_pages_slug";
alter table "public"."site_blocks" add constraint "UQ_site_blocks_slug" UNIQUE using index "UQ_site_blocks_slug";
alter table "public"."site_domains" add constraint "UQ_site_domains_hostname" UNIQUE using index "UQ_site_domains_hostname";

-- Now update existing tables from init_tables.sql to use camelCase columns

-- Update counters table columns to camelCase
-- First add new columns
alter table "public"."counters" add column if not exists "createdAt" timestamp with time zone not null default now();
alter table "public"."counters" add column if not exists "updatedAt" timestamp with time zone not null default now();

-- Drop old columns
alter table "public"."counters" drop column if exists "created_at";
alter table "public"."counters" drop column if exists "updated_at";

-- Update email_click_events table columns to camelCase
-- First add new columns with default values
alter table "public"."email_click_events" add column if not exists "buttonText" character varying;
alter table "public"."email_click_events" add column if not exists "clickedAt" timestamp(6) with time zone;
alter table "public"."email_click_events" add column if not exists "createdAt" timestamp with time zone not null default now();
alter table "public"."email_click_events" add column if not exists "updatedAt" timestamp with time zone not null default now();

-- Migrate data from old columns to new columns
UPDATE "public"."email_click_events" 
SET "buttonText" = "button_text", 
    "clickedAt" = "clicked_at"::timestamp(6) with time zone
WHERE "buttonText" IS NULL OR "clickedAt" IS NULL;

-- Now make the columns NOT NULL and drop old columns
alter table "public"."email_click_events" alter column "buttonText" set not null;
alter table "public"."email_click_events" alter column "clickedAt" set not null;

alter table "public"."email_click_events" drop column if exists "button_text";
alter table "public"."email_click_events" drop column if exists "clicked_at";
alter table "public"."email_click_events" drop column if exists "created_at";
alter table "public"."email_click_events" drop column if exists "updated_at";

-- Update email_open_events table columns to camelCase
-- First add new columns with default values
alter table "public"."email_open_events" add column if not exists "createdAt" timestamp with time zone not null default now();
alter table "public"."email_open_events" add column if not exists "openedAt" timestamp(6) with time zone;
alter table "public"."email_open_events" add column if not exists "updatedAt" timestamp with time zone not null default now();

-- Migrate data from old columns to new columns
UPDATE "public"."email_open_events" 
SET "openedAt" = "opened_at"::timestamp(6) with time zone
WHERE "openedAt" IS NULL;

-- Now make the column NOT NULL and drop old columns
alter table "public"."email_open_events" alter column "openedAt" set not null;

alter table "public"."email_open_events" drop column if exists "created_at";
alter table "public"."email_open_events" drop column if exists "opened_at";
alter table "public"."email_open_events" drop column if exists "updated_at";

-- Update emails table columns to camelCase
-- First add new columns
alter table "public"."emails" add column if not exists "createdAt" timestamp with time zone not null default now();
alter table "public"."emails" add column if not exists "errorLog" character varying;
alter table "public"."emails" add column if not exists "failedAt" timestamp(6) with time zone;
alter table "public"."emails" add column if not exists "sentAt" timestamp(6) with time zone;
alter table "public"."emails" add column if not exists "updatedAt" timestamp with time zone not null default now();

-- Migrate data from old columns to new columns
UPDATE "public"."emails" 
SET "errorLog" = "error_log",
    "failedAt" = "failed_at"::timestamp(6) with time zone,
    "sentAt" = "sent_at"::timestamp(6) with time zone
WHERE "errorLog" IS NULL OR "failedAt" IS NULL OR "sentAt" IS NULL;

-- Drop old columns
alter table "public"."emails" drop column if exists "created_at";
alter table "public"."emails" drop column if exists "error_log";
alter table "public"."emails" drop column if exists "failed_at";
alter table "public"."emails" drop column if exists "sent_at";
alter table "public"."emails" drop column if exists "updated_at";



-- Update users table columns to camelCase
-- First add new columns
alter table "public"."users" add column if not exists "createdAt" timestamp with time zone not null default now();
alter table "public"."users" add column if not exists "updatedAt" timestamp with time zone not null default now();

-- Drop old columns
alter table "public"."users" drop column if exists "created_at";
alter table "public"."users" drop column if exists "updated_at";



-- Create new unique index for site_releases with updated constraint name
CREATE UNIQUE INDEX "IDX_48b84660522d2428ca6d23119c" ON public.site_releases USING btree ("siteId", version);

-- Add foreign key constraints with TypeORM-generated names
alter table "public"."site_blocks" add constraint "FK_04adc5fbb09eb32db0c746eee20" FOREIGN KEY ("pageId") REFERENCES site_pages(id) not valid;
alter table "public"."site_blocks" validate constraint "FK_04adc5fbb09eb32db0c746eee20";

alter table "public"."site_blocks" add constraint "FK_2e9c736c4ab706d49188947ad92" FOREIGN KEY ("siteId") REFERENCES sites(id) not valid;
alter table "public"."site_blocks" validate constraint "FK_2e9c736c4ab706d49188947ad92";

alter table "public"."site_domains" add constraint "FK_b64cc9e1f0a969eea87380c462d" FOREIGN KEY ("siteId") REFERENCES sites(id) ON DELETE CASCADE not valid;
alter table "public"."site_domains" validate constraint "FK_b64cc9e1f0a969eea87380c462d";

alter table "public"."site_pages" add constraint "FK_4029d13e5c69a098b2076c761c3" FOREIGN KEY ("siteId") REFERENCES sites(id) not valid;
alter table "public"."site_pages" validate constraint "FK_4029d13e5c69a098b2076c761c3";

alter table "public"."site_releases" add constraint "FK_5c72a2f81f04dd6c238771c591f" FOREIGN KEY ("siteId") REFERENCES sites(id) ON DELETE CASCADE not valid;
alter table "public"."site_releases" validate constraint "FK_5c72a2f81f04dd6c238771c591f";

alter table "public"."sites" add constraint "FK_a5c4bd58c29138cf04e170dfa67" FOREIGN KEY ("authorId") REFERENCES users(id) not valid;
alter table "public"."sites" validate constraint "FK_a5c4bd58c29138cf04e170dfa67";

-- Grant permissions to all roles for new tables
-- Assets table permissions
grant delete on table "public"."assets" to "anon";
grant insert on table "public"."assets" to "anon";
grant references on table "public"."assets" to "anon";
grant select on table "public"."assets" to "anon";
grant trigger on table "public"."assets" to "anon";
grant truncate on table "public"."assets" to "anon";
grant update on table "public"."assets" to "anon";

grant delete on table "public"."assets" to "authenticated";
grant insert on table "public"."assets" to "authenticated";
grant references on table "public"."assets" to "authenticated";
grant select on table "public"."assets" to "authenticated";
grant trigger on table "public"."assets" to "authenticated";
grant truncate on table "public"."assets" to "authenticated";
grant update on table "public"."assets" to "authenticated";

grant delete on table "public"."assets" to "service_role";
grant insert on table "public"."assets" to "service_role";
grant references on table "public"."assets" to "service_role";
grant select on table "public"."assets" to "service_role";
grant trigger on table "public"."assets" to "service_role";
grant truncate on table "public"."assets" to "service_role";
grant update on table "public"."assets" to "service_role";

-- Sites table permissions
grant delete on table "public"."sites" to "anon";
grant insert on table "public"."sites" to "anon";
grant references on table "public"."sites" to "anon";
grant select on table "public"."sites" to "anon";
grant trigger on table "public"."sites" to "anon";
grant truncate on table "public"."sites" to "anon";
grant update on table "public"."sites" to "anon";

grant delete on table "public"."sites" to "authenticated";
grant insert on table "public"."sites" to "authenticated";
grant references on table "public"."sites" to "authenticated";
grant select on table "public"."sites" to "authenticated";
grant trigger on table "public"."sites" to "authenticated";
grant truncate on table "public"."sites" to "authenticated";
grant update on table "public"."sites" to "authenticated";

grant delete on table "public"."sites" to "service_role";
grant insert on table "public"."sites" to "service_role";
grant references on table "public"."sites" to "service_role";
grant select on table "public"."sites" to "service_role";
grant trigger on table "public"."sites" to "service_role";
grant truncate on table "public"."sites" to "service_role";
grant update on table "public"."sites" to "service_role";

-- Site pages table permissions
grant delete on table "public"."site_pages" to "anon";
grant insert on table "public"."site_pages" to "anon";
grant references on table "public"."site_pages" to "anon";
grant select on table "public"."site_pages" to "anon";
grant trigger on table "public"."site_pages" to "anon";
grant truncate on table "public"."site_pages" to "anon";
grant update on table "public"."site_pages" to "anon";

grant delete on table "public"."site_pages" to "authenticated";
grant insert on table "public"."site_pages" to "authenticated";
grant references on table "public"."site_pages" to "authenticated";
grant select on table "public"."site_pages" to "authenticated";
grant trigger on table "public"."site_pages" to "authenticated";
grant truncate on table "public"."site_pages" to "authenticated";
grant update on table "public"."site_pages" to "authenticated";

grant delete on table "public"."site_pages" to "service_role";
grant insert on table "public"."site_pages" to "service_role";
grant references on table "public"."site_pages" to "service_role";
grant select on table "public"."site_pages" to "service_role";
grant trigger on table "public"."site_pages" to "service_role";
grant truncate on table "public"."site_pages" to "service_role";
grant update on table "public"."site_pages" to "service_role";

-- Site blocks table permissions
grant delete on table "public"."site_blocks" to "anon";
grant insert on table "public"."site_blocks" to "anon";
grant references on table "public"."site_blocks" to "anon";
grant select on table "public"."site_blocks" to "anon";
grant trigger on table "public"."site_blocks" to "anon";
grant truncate on table "public"."site_blocks" to "anon";
grant update on table "public"."site_blocks" to "anon";

grant delete on table "public"."site_blocks" to "authenticated";
grant insert on table "public"."site_blocks" to "authenticated";
grant references on table "public"."site_blocks" to "authenticated";
grant select on table "public"."site_blocks" to "authenticated";
grant trigger on table "public"."site_blocks" to "authenticated";
grant truncate on table "public"."site_blocks" to "authenticated";
grant update on table "public"."site_blocks" to "authenticated";

grant delete on table "public"."site_blocks" to "service_role";
grant insert on table "public"."site_blocks" to "service_role";
grant references on table "public"."site_blocks" to "service_role";
grant select on table "public"."site_blocks" to "service_role";
grant trigger on table "public"."site_blocks" to "service_role";
grant truncate on table "public"."site_blocks" to "service_role";
grant update on table "public"."site_blocks" to "service_role";

-- Site domains table permissions
grant delete on table "public"."site_domains" to "anon";
grant insert on table "public"."site_domains" to "anon";
grant references on table "public"."site_domains" to "anon";
grant select on table "public"."site_domains" to "anon";
grant trigger on table "public"."site_domains" to "anon";
grant truncate on table "public"."site_domains" to "anon";
grant update on table "public"."site_domains" to "anon";

grant delete on table "public"."site_domains" to "authenticated";
grant insert on table "public"."site_domains" to "authenticated";
grant references on table "public"."site_domains" to "authenticated";
grant select on table "public"."site_domains" to "authenticated";
grant trigger on table "public"."site_domains" to "authenticated";
grant truncate on table "public"."site_domains" to "authenticated";
grant update on table "public"."site_domains" to "authenticated";

grant delete on table "public"."site_domains" to "service_role";
grant insert on table "public"."site_domains" to "service_role";
grant references on table "public"."site_domains" to "service_role";
grant select on table "public"."site_domains" to "service_role";
grant trigger on table "public"."site_domains" to "service_role";
grant truncate on table "public"."site_domains" to "service_role";
grant update on table "public"."site_domains" to "service_role";

-- Site releases table permissions
grant delete on table "public"."site_releases" to "anon";
grant insert on table "public"."site_releases" to "anon";
grant references on table "public"."site_releases" to "anon";
grant select on table "public"."site_releases" to "anon";
grant trigger on table "public"."site_releases" to "anon";
grant truncate on table "public"."site_releases" to "anon";
grant update on table "public"."site_releases" to "anon";

grant delete on table "public"."site_releases" to "authenticated";
grant insert on table "public"."site_releases" to "authenticated";
grant references on table "public"."site_releases" to "authenticated";
grant select on table "public"."site_releases" to "authenticated";
grant trigger on table "public"."site_releases" to "authenticated";
grant truncate on table "public"."site_releases" to "authenticated";
grant update on table "public"."site_releases" to "authenticated";

grant delete on table "public"."site_releases" to "service_role";
grant insert on table "public"."site_releases" to "service_role";
grant references on table "public"."site_releases" to "service_role";
grant select on table "public"."site_releases" to "service_role";
grant trigger on table "public"."site_releases" to "service_role";
grant truncate on table "public"."site_releases" to "service_role";
grant update on table "public"."site_releases" to "service_role";
