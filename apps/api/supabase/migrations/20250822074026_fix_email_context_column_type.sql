-- Fix email context column type to ensure it only accepts JSON objects
-- This migration ensures the column type matches your entity definition (Record<string, string>)

-- Add constraint to ensure context only contains objects (not arrays or primitives)
ALTER TABLE emails ADD CONSTRAINT emails_context_must_be_object 
CHECK (context IS NULL OR jsonb_typeof(context) = 'object');
