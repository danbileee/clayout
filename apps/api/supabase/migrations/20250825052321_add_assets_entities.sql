-- Create enum for asset types
create type "public"."asset_types_enum" as enum ('Site', 'SitePage', 'SiteBlock');

-- Create sequence for auto-incrementing ID
create sequence "public"."assets_id_seq";

-- Create assets table
create table "public"."assets" (
    "id" integer not null default nextval('assets_id_seq'::regclass),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "order" integer not null default 0,
    "target_type" asset_types_enum not null,
    "target_id" integer not null,
    "path" character varying not null
);

-- Enable RLS on assets table
alter table "public"."assets" enable row level security;

-- Set sequence ownership
alter sequence "public"."assets_id_seq" owned by "public"."assets"."id";

-- Create primary key index
CREATE UNIQUE INDEX "PK_assets_id" ON public.assets USING btree (id);

-- Create index for target lookup (for efficient queries by target_type and target_id)
CREATE INDEX "IDX_assets_target" ON public.assets USING btree ("target_type", "target_id");

-- Create index for ordering (for efficient queries by order)
CREATE INDEX "IDX_assets_order" ON public.assets USING btree ("order");

-- Add primary key constraint
alter table "public"."assets" add constraint "PK_assets_id" PRIMARY KEY using index "PK_assets_id";

-- Grant permissions to all roles
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
