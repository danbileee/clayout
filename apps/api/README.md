# Clayout API Server

## Local

### Start Supabse DB

```sh
supabase start
```

When developing locally with Supabase, the workflow is:

1. Create tables manually in your local development environment first. You can do this through:

- SQL queries in the Supabase Studio (http://127.0.0.1:54323)
- Direct SQL queries via pgAdmin or psql
- Migration files (which we'll discuss below)

2. Test your changes locally to make sure everything works as expected.

3. Create migration files to track your schema changes. This is the recommended approach for production:

```sh
# Create a new migration
supabase migration new create_example_table
```

This creates a timestamped SQL file in the supabase/migrations folder where you can add your CREATE TABLE statements and other schema changes.

4. Apply migrations locally (if you created them after making manual changes):

```sh
supabase db reset
```

This resets your local database and applies all migrations.

5. Push to production when ready:

```sh
supabase db push
```

This applies your local migrations to your remote Supabase project.

This workflow ensures that:

You can develop and test locally first
Your schema changes are tracked in version control
You can easily deploy the same changes to production

### Open API server

```sh
pnpm i
pnpm dev:start
```
