-- AlterTable
ALTER TABLE "Collection" ADD COLUMN IF NOT EXISTS "coverImages" TEXT[] DEFAULT ARRAY[]::TEXT[];

UPDATE "Collection"
SET "coverImages" = ARRAY["coverImage"]::TEXT[]
WHERE "coverImage" IS NOT NULL
  AND cardinality("coverImages") = 0;
