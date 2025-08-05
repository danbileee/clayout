-- Create enum for user roles
create type "public"."users_role_enum" as enum ('None', 'Guest', 'Registrant', 'User', 'Admin');

-- Create sequences for auto-incrementing IDs
create sequence "public"."counters_id_seq";
create sequence "public"."email_click_events_id_seq";
create sequence "public"."email_open_events_id_seq";
create sequence "public"."emails_id_seq";
create sequence "public"."users_id_seq";

-- Create counters table
create table "public"."counters" (
    "id" integer not null default nextval('counters_id_seq'::regclass),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "value" character varying,
    "count" integer not null default 0
);

-- Enable RLS on counters table
alter table "public"."counters" enable row level security;

-- Create email_click_events table
create table "public"."email_click_events" (
    "id" integer not null default nextval('email_click_events_id_seq'::regclass),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "link" character varying not null,
    "clicked_at" timestamp with time zone not null,
    "button_text" character varying not null,
    "emailId" integer
);

-- Create email_open_events table
create table "public"."email_open_events" (
    "id" integer not null default nextval('email_open_events_id_seq'::regclass),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "opened_at" timestamp with time zone not null,
    "emailId" integer
);

-- Create emails table
create table "public"."emails" (
    "id" integer not null default nextval('emails_id_seq'::regclass),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "to" character varying not null,
    "subject" character varying not null,
    "template" character varying not null,
    "context" jsonb,
    "userId" integer,
    "sent_at" timestamp with time zone,
    "failed_at" timestamp with time zone,
    "error_log" character varying
);

-- Create users table
create table "public"."users" (
    "id" integer not null default nextval('users_id_seq'::regclass),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "username" character varying(20) not null,
    "email" character varying not null,
    "password" character varying not null,
    "role" users_role_enum not null default 'None'::users_role_enum
);

-- Enable RLS on users table
alter table "public"."users" enable row level security;

-- Set sequence ownership
alter sequence "public"."counters_id_seq" owned by "public"."counters"."id";
alter sequence "public"."email_click_events_id_seq" owned by "public"."email_click_events"."id";
alter sequence "public"."email_open_events_id_seq" owned by "public"."email_open_events"."id";
alter sequence "public"."emails_id_seq" owned by "public"."emails"."id";
alter sequence "public"."users_id_seq" owned by "public"."users"."id";

-- Create primary key indexes
CREATE UNIQUE INDEX "PK_3cd9e5eeb5374ce155a32295651" ON public.email_click_events USING btree (id);
CREATE UNIQUE INDEX "PK_4fc21fdc5476d8597f8c90c5f83" ON public.email_open_events USING btree (id);
CREATE UNIQUE INDEX "PK_910bfcbadea9cde6397e0daf996" ON public.counters USING btree (id);
CREATE UNIQUE INDEX "PK_a3ffb1c0c8416b9fc6f907b7433" ON public.users USING btree (id);
CREATE UNIQUE INDEX "PK_a54dcebef8d05dca7e839749571" ON public.emails USING btree (id);

-- Create unique constraint indexes
CREATE UNIQUE INDEX "UQ_97672ac88f789774dd47f7c8be3" ON public.users USING btree (email);
CREATE UNIQUE INDEX "UQ_fe0bb3f6520ee0469504521e710" ON public.users USING btree (username);

-- Add primary key constraints
alter table "public"."counters" add constraint "PK_910bfcbadea9cde6397e0daf996" PRIMARY KEY using index "PK_910bfcbadea9cde6397e0daf996";
alter table "public"."email_click_events" add constraint "PK_3cd9e5eeb5374ce155a32295651" PRIMARY KEY using index "PK_3cd9e5eeb5374ce155a32295651";
alter table "public"."email_open_events" add constraint "PK_4fc21fdc5476d8597f8c90c5f83" PRIMARY KEY using index "PK_4fc21fdc5476d8597f8c90c5f83";
alter table "public"."emails" add constraint "PK_a54dcebef8d05dca7e839749571" PRIMARY KEY using index "PK_a54dcebef8d05dca7e839749571";
alter table "public"."users" add constraint "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY using index "PK_a3ffb1c0c8416b9fc6f907b7433";

-- Add foreign key constraints
alter table "public"."email_click_events" add constraint "FK_0481f77b1f72ae9917dc4032169" FOREIGN KEY ("emailId") REFERENCES emails(id) not valid;
alter table "public"."email_click_events" validate constraint "FK_0481f77b1f72ae9917dc4032169";

alter table "public"."email_open_events" add constraint "FK_b24da482ee134d7532fd27c747d" FOREIGN KEY ("emailId") REFERENCES emails(id) not valid;
alter table "public"."email_open_events" validate constraint "FK_b24da482ee134d7532fd27c747d";

alter table "public"."emails" add constraint "FK_1c41bc3d329b0edc905b6409dba" FOREIGN KEY ("userId") REFERENCES users(id) not valid;
alter table "public"."emails" validate constraint "FK_1c41bc3d329b0edc905b6409dba";

-- Add unique constraints
alter table "public"."users" add constraint "UQ_97672ac88f789774dd47f7c8be3" UNIQUE using index "UQ_97672ac88f789774dd47f7c8be3";
alter table "public"."users" add constraint "UQ_fe0bb3f6520ee0469504521e710" UNIQUE using index "UQ_fe0bb3f6520ee0469504521e710";

-- Grant permissions to anon role
grant delete on table "public"."counters" to "anon";
grant insert on table "public"."counters" to "anon";
grant references on table "public"."counters" to "anon";
grant select on table "public"."counters" to "anon";
grant trigger on table "public"."counters" to "anon";
grant truncate on table "public"."counters" to "anon";
grant update on table "public"."counters" to "anon";

grant delete on table "public"."email_click_events" to "anon";
grant insert on table "public"."email_click_events" to "anon";
grant references on table "public"."email_click_events" to "anon";
grant select on table "public"."email_click_events" to "anon";
grant trigger on table "public"."email_click_events" to "anon";
grant truncate on table "public"."email_click_events" to "anon";
grant update on table "public"."email_click_events" to "anon";

grant delete on table "public"."email_open_events" to "anon";
grant insert on table "public"."email_open_events" to "anon";
grant references on table "public"."email_open_events" to "anon";
grant select on table "public"."email_open_events" to "anon";
grant trigger on table "public"."email_open_events" to "anon";
grant truncate on table "public"."email_open_events" to "anon";
grant update on table "public"."email_open_events" to "anon";

grant delete on table "public"."emails" to "anon";
grant insert on table "public"."emails" to "anon";
grant references on table "public"."emails" to "anon";
grant select on table "public"."emails" to "anon";
grant trigger on table "public"."emails" to "anon";
grant truncate on table "public"."emails" to "anon";
grant update on table "public"."emails" to "anon";

grant delete on table "public"."users" to "anon";
grant insert on table "public"."users" to "anon";
grant references on table "public"."users" to "anon";
grant select on table "public"."users" to "anon";
grant trigger on table "public"."users" to "anon";
grant truncate on table "public"."users" to "anon";
grant update on table "public"."users" to "anon";

-- Grant permissions to authenticated role
grant delete on table "public"."counters" to "authenticated";
grant insert on table "public"."counters" to "authenticated";
grant references on table "public"."counters" to "authenticated";
grant select on table "public"."counters" to "authenticated";
grant trigger on table "public"."counters" to "authenticated";
grant truncate on table "public"."counters" to "authenticated";
grant update on table "public"."counters" to "authenticated";

grant delete on table "public"."email_click_events" to "authenticated";
grant insert on table "public"."email_click_events" to "authenticated";
grant references on table "public"."email_click_events" to "authenticated";
grant select on table "public"."email_click_events" to "authenticated";
grant trigger on table "public"."email_click_events" to "authenticated";
grant truncate on table "public"."email_click_events" to "authenticated";
grant update on table "public"."email_click_events" to "authenticated";

grant delete on table "public"."email_open_events" to "authenticated";
grant insert on table "public"."email_open_events" to "authenticated";
grant references on table "public"."email_open_events" to "authenticated";
grant select on table "public"."email_open_events" to "authenticated";
grant trigger on table "public"."email_open_events" to "authenticated";
grant truncate on table "public"."email_open_events" to "authenticated";
grant update on table "public"."email_open_events" to "authenticated";

grant delete on table "public"."emails" to "authenticated";
grant insert on table "public"."emails" to "authenticated";
grant references on table "public"."emails" to "authenticated";
grant select on table "public"."emails" to "authenticated";
grant trigger on table "public"."emails" to "authenticated";
grant truncate on table "public"."emails" to "authenticated";
grant update on table "public"."emails" to "authenticated";

grant delete on table "public"."users" to "authenticated";
grant insert on table "public"."users" to "authenticated";
grant references on table "public"."users" to "authenticated";
grant select on table "public"."users" to "authenticated";
grant trigger on table "public"."users" to "authenticated";
grant truncate on table "public"."users" to "authenticated";
grant update on table "public"."users" to "authenticated";

-- Grant permissions to service_role
grant delete on table "public"."counters" to "service_role";
grant insert on table "public"."counters" to "service_role";
grant references on table "public"."counters" to "service_role";
grant select on table "public"."counters" to "service_role";
grant trigger on table "public"."counters" to "service_role";
grant truncate on table "public"."counters" to "service_role";
grant update on table "public"."counters" to "service_role";

grant delete on table "public"."email_click_events" to "service_role";
grant insert on table "public"."email_click_events" to "service_role";
grant references on table "public"."email_click_events" to "service_role";
grant select on table "public"."email_click_events" to "service_role";
grant trigger on table "public"."email_click_events" to "service_role";
grant truncate on table "public"."email_click_events" to "service_role";
grant update on table "public"."email_click_events" to "service_role";

grant delete on table "public"."email_open_events" to "service_role";
grant insert on table "public"."email_open_events" to "service_role";
grant references on table "public"."email_open_events" to "service_role";
grant select on table "public"."email_open_events" to "service_role";
grant trigger on table "public"."email_open_events" to "service_role";
grant truncate on table "public"."email_open_events" to "service_role";
grant update on table "public"."email_open_events" to "service_role";

grant delete on table "public"."emails" to "service_role";
grant insert on table "public"."emails" to "service_role";
grant references on table "public"."emails" to "service_role";
grant select on table "public"."emails" to "service_role";
grant trigger on table "public"."emails" to "service_role";
grant truncate on table "public"."emails" to "service_role";
grant update on table "public"."emails" to "service_role";

grant delete on table "public"."users" to "service_role";
grant insert on table "public"."users" to "service_role";
grant references on table "public"."users" to "service_role";
grant select on table "public"."users" to "service_role";
grant trigger on table "public"."users" to "service_role";
grant truncate on table "public"."users" to "service_role";
grant update on table "public"."users" to "service_role";
