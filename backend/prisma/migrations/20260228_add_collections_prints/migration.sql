-- Add Collection model
CREATE TABLE IF NOT EXISTS "Collection" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "coverImage" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- Add new columns to Painting
ALTER TABLE "Painting" ADD COLUMN IF NOT EXISTS "originalPrice" DOUBLE PRECISION;
ALTER TABLE "Painting" ADD COLUMN IF NOT EXISTS "originalAvailable" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Painting" ADD COLUMN IF NOT EXISTS "printPrice" DOUBLE PRECISION;
ALTER TABLE "Painting" ADD COLUMN IF NOT EXISTS "printAvailable" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Painting" ADD COLUMN IF NOT EXISTS "heroImage" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Painting" ADD COLUMN IF NOT EXISTS "category" TEXT NOT NULL DEFAULT 'original';
ALTER TABLE "Painting" ADD COLUMN IF NOT EXISTS "collectionId" TEXT;

-- Migrate existing price to originalPrice
UPDATE "Painting" SET "originalPrice" = "price" WHERE "originalPrice" IS NULL AND "price" IS NOT NULL;
UPDATE "Painting" SET "originalAvailable" = NOT "sold";

-- Add version to OrderItem
ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "version" TEXT NOT NULL DEFAULT 'original';

-- Add foreign key
DO $$ BEGIN
  ALTER TABLE "Painting" ADD CONSTRAINT "Painting_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Create migration tracking (if not exists)
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
  "id" VARCHAR(36) NOT NULL,
  "checksum" VARCHAR(64) NOT NULL,
  "finished_at" TIMESTAMPTZ,
  "migration_name" VARCHAR(255) NOT NULL,
  "logs" TEXT,
  "rolled_back_at" TIMESTAMPTZ,
  "started_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "applied_steps_count" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
);
