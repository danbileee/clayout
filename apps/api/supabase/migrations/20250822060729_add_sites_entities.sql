-- Create enums for site-related entities
create type "public"."sites_status_enum" as enum ('Draft', 'Published', 'Reviewing', 'Fixing');
create type "public"."sites_category_enum" as enum ('None', 'Blog', 'Landing Page', 'Newsletter', 'Portfolio', 'Hyperlink', 'Commerce');
create type "public"."site_pages_category_enum" as enum ('Static', 'List', 'Article');
create type "public"."site_blocks_type_enum" as enum ('None', 'Text', 'Image', 'Button');

-- Create sequences for auto-incrementing IDs
create sequence "public"."site_blocks_id_seq";
create sequence "public"."site_domains_id_seq";
create sequence "public"."site_pages_id_seq";
create sequence "public"."site_releases_id_seq";
create sequence "public"."sites_id_seq";

-- Create sites table
create table "public"."sites" (
    "id" integer not null default nextval('sites_id_seq'::regclass),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "slug" character varying not null,
    "name" character varying not null,
    "status" sites_status_enum not null default 'Draft'::sites_status_enum,
    "category" sites_category_enum not null default 'None'::sites_category_enum,
    "meta" jsonb,
    "last_published_at" timestamp with time zone,
    "authorId" integer not null
);

-- Create site_pages table
create table "public"."site_pages" (
    "id" integer not null default nextval('site_pages_id_seq'::regclass),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "slug" character varying not null,
    "name" character varying not null,
    "category" site_pages_category_enum not null default 'Static'::site_pages_category_enum,
    "meta" jsonb,
    "siteId" integer not null
);

-- Create site_blocks table
create table "public"."site_blocks" (
    "id" integer not null default nextval('site_blocks_id_seq'::regclass),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "slug" character varying not null,
    "name" character varying not null,
    "type" site_blocks_type_enum not null default 'None'::site_blocks_type_enum,
    "data" jsonb,
    "style" jsonb,
    "container_style" jsonb,
    "pageId" integer not null,
    "siteId" integer not null
);

-- Create site_domains table
create table "public"."site_domains" (
    "id" integer not null default nextval('site_domains_id_seq'::regclass),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "hostname" character varying not null,
    "is_verified" boolean not null default false,
    "siteId" integer not null
);

-- Create site_releases table
create table "public"."site_releases" (
    "id" integer not null default nextval('site_releases_id_seq'::regclass),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "html_snapshot" text not null,
    "published_at" timestamp with time zone,
    "version" integer not null,
    "siteId" integer not null
);

-- Enable RLS on all site-related tables
alter table "public"."sites" enable row level security;
alter table "public"."site_pages" enable row level security;
alter table "public"."site_blocks" enable row level security;
alter table "public"."site_domains" enable row level security;
alter table "public"."site_releases" enable row level security;

-- Set sequence ownership
alter sequence "public"."site_blocks_id_seq" owned by "public"."site_blocks"."id";
alter sequence "public"."site_domains_id_seq" owned by "public"."site_domains"."id";
alter sequence "public"."site_pages_id_seq" owned by "public"."site_pages"."id";
alter sequence "public"."site_releases_id_seq" owned by "public"."site_releases"."id";
alter sequence "public"."sites_id_seq" owned by "public"."sites"."id";

-- Create primary key indexes
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
CREATE UNIQUE INDEX "UQ_site_releases_site_version" ON public.site_releases USING btree ("siteId", version);

-- Add primary key constraints
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
alter table "public"."site_releases" add constraint "UQ_site_releases_site_version" UNIQUE using index "UQ_site_releases_site_version";

-- Add foreign key constraints
alter table "public"."sites" add constraint "FK_sites_author" FOREIGN KEY ("authorId") REFERENCES users(id) not valid;
alter table "public"."sites" validate constraint "FK_sites_author";

alter table "public"."site_pages" add constraint "FK_site_pages_site" FOREIGN KEY ("siteId") REFERENCES sites(id) ON DELETE CASCADE not valid;
alter table "public"."site_pages" validate constraint "FK_site_pages_site";

alter table "public"."site_blocks" add constraint "FK_site_blocks_page" FOREIGN KEY ("pageId") REFERENCES site_pages(id) ON DELETE CASCADE not valid;
alter table "public"."site_blocks" validate constraint "FK_site_blocks_page";

alter table "public"."site_blocks" add constraint "FK_site_blocks_site" FOREIGN KEY ("siteId") REFERENCES sites(id) ON DELETE CASCADE not valid;
alter table "public"."site_blocks" validate constraint "FK_site_blocks_site";

alter table "public"."site_domains" add constraint "FK_site_domains_site" FOREIGN KEY ("siteId") REFERENCES sites(id) ON DELETE CASCADE not valid;
alter table "public"."site_domains" validate constraint "FK_site_domains_site";

alter table "public"."site_releases" add constraint "FK_site_releases_site" FOREIGN KEY ("siteId") REFERENCES sites(id) ON DELETE CASCADE not valid;
alter table "public"."site_releases" validate constraint "FK_site_releases_site";
