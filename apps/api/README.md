# Clayout API Server

## Local

### Start Supabase DB

```sh
supabase start
```

When developing locally with Supabase, the workflow is:

1. Create tables manually in your local development environment first. You can do this through:

- SQL queries in the Supabase Studio (http://127.0.0.1:54323)
- Direct SQL queries via pgAdmin or psql
- Migration files (which we'll discuss below)

2. Test your changes locally to make sure everything works as expected.

```sh
# Generate type definitions according to the table schema
pnpm supabase:gentypes
```

3. Create migration files to track your schema changes. This is the recommended approach for production:

```sh
# Create a new migration
supabase migration new create_example_table

# Check the migration status
supabase migration list

# Backup before production
supabase db dump --data-only > backup.sql
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

## Post-Deployment Migration Workflow

If you've already deployed schema changes to production without creating migration files, you can generate them retroactively:

### 1. Generate Migration from Current Schema

```sh
# Create a new migration file
supabase migration new create_example_table

# Get the current schema diff
supabase db diff --schema public
```

### 2. Populate the Migration File

Copy the output from `supabase db diff` into your newly created migration file. This captures all current schema changes including:

- Tables and their structure
- Indexes and constraints
- Foreign key relationships
- Row Level Security (RLS) settings
- Permissions for different roles

### 3. Verify the Migration

```sh
# Reset local database to test the migration
supabase db reset

# Verify no differences remain
supabase db diff --schema public
```

### 4. Update TypeScript Types

```sh
# Regenerate types to match current schema
pnpm supabase:gentypes
```

This workflow ensures that:

- You can develop and test locally first
- Your schema changes are tracked in version control
- You can easily deploy the same changes to production
- **Post-deployment migrations are properly captured for future deployments**

### Open API server

```sh
pnpm i
pnpm dev:start
```
