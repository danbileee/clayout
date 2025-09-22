-- Remove global unique constraint from site_blocks.slug
-- This allows the same slug to exist across different pages/sites
-- while maintaining uniqueness within each page via the composite index

-- Drop the global unique constraint and index
ALTER TABLE public.site_blocks DROP CONSTRAINT IF EXISTS "UQ_site_blocks_slug";
DROP INDEX IF EXISTS "UQ_site_blocks_slug";

-- ============================================================
-- Backfill: Ensure each site has exactly one primary domain
-- Policy:
-- 1) If a site already has a primary domain, skip.
-- 2) If a site has domains but none primary, promote one to primary (lowest id).
-- 3) If a site has no domains, insert default `${slug}.clayout.app` as primary.
-- All steps are idempotent.
-- ============================================================

-- 1) Promote an existing domain to primary for sites with domains but none marked primary
WITH candidates AS (
  SELECT DISTINCT ON (d."siteId")
         d.id
  FROM public.site_domains d
  LEFT JOIN public.site_domains p
    ON p."siteId" = d."siteId" AND p."isPrimary" = true
  WHERE p.id IS NULL
  ORDER BY d."siteId", d.id ASC
)
UPDATE public.site_domains sd
SET "isPrimary" = true
FROM candidates c
WHERE sd.id = c.id
  AND sd."isPrimary" <> true;

-- 2) Insert default domain for sites with no domains
INSERT INTO public.site_domains ("siteId", hostname, status, "isPrimary", "createdAt", "updatedAt")
SELECT s.id AS "siteId",
       (s.slug || '.clayout.app') AS hostname,
       'Pending'::site_domains_status_enum AS status,
       true AS "isPrimary",
       NOW() AS "createdAt",
       NOW() AS "updatedAt"
FROM public.sites s
LEFT JOIN public.site_domains d ON d."siteId" = s.id
WHERE d."siteId" IS NULL
ON CONFLICT (hostname) DO NOTHING;

-- 3) If multiple primaries exist (legacy data), keep only the lowest id as primary
WITH ranked AS (
  SELECT id,
         "siteId",
         ROW_NUMBER() OVER (PARTITION BY "siteId" ORDER BY id) AS rn
  FROM public.site_domains
  WHERE "isPrimary" = true
)
UPDATE public.site_domains sd
SET "isPrimary" = false
FROM ranked r
WHERE sd.id = r.id
  AND r.rn > 1
  AND sd."isPrimary" = true;

-- ============================================================
-- Constraints and Indexes to enforce invariants and performance
-- ============================================================

-- Normalize existing staging indexes to canonical definitions
DROP INDEX IF EXISTS "UQ_site_domains_one_primary_per_site";
DROP INDEX IF EXISTS "IDX_site_domains_siteId";

-- Ensure hostname uniqueness (use an index; idempotent)
CREATE UNIQUE INDEX IF NOT EXISTS "UQ_site_domains_hostname"
  ON public.site_domains (hostname);

-- Ensure at most one primary domain per site (partial unique index)
CREATE UNIQUE INDEX IF NOT EXISTS "UQ_site_domains_one_primary_per_site"
  ON public.site_domains ("siteId")
  WHERE "isPrimary" = true;

-- Index for siteId to speed lookups
CREATE INDEX IF NOT EXISTS "IDX_site_domains_siteId" ON public.site_domains ("siteId");

-- ============================================================
-- Observability: counts for verification
-- ============================================================

-- Count sites with no domains
-- SELECT COUNT(*) AS sites_without_any_domain
-- FROM public.sites s
-- LEFT JOIN public.site_domains d ON d."siteId" = s.id
-- WHERE d."siteId" IS NULL;

-- Count sites with zero primary domain
-- SELECT COUNT(*) AS sites_without_primary
-- FROM public.sites s
-- LEFT JOIN (
--   SELECT DISTINCT "siteId" FROM public.site_domains WHERE "isPrimary" = true
-- ) p ON p."siteId" = s.id
-- WHERE p."siteId" IS NULL;

-- Count sites with more than one primary (should be zero after fixes)
-- SELECT COUNT(*) AS sites_with_multiple_primary
-- FROM (
--   SELECT "siteId", COUNT(*)
--   FROM public.site_domains
--   WHERE "isPrimary" = true
--   GROUP BY "siteId"
--   HAVING COUNT(*) > 1
-- ) t;
