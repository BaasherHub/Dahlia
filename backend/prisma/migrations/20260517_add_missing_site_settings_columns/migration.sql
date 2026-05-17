-- Add missing SiteSettings columns that exist in schema but were never migrated
ALTER TABLE "SiteSettings"
  ADD COLUMN IF NOT EXISTS "exhibitions"       TEXT NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "publications"      TEXT NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "aboutArtistImage"  TEXT;
