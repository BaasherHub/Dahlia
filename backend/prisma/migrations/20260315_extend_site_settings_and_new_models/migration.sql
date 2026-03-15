-- Extend SiteSettings with new content fields
ALTER TABLE "SiteSettings"
  ADD COLUMN IF NOT EXISTS "heroTitle"              TEXT NOT NULL DEFAULT 'Dahlia Baasher',
  ADD COLUMN IF NOT EXISTS "heroSubtitle"           TEXT NOT NULL DEFAULT 'Contemporary Oil Paintings',
  ADD COLUMN IF NOT EXISTS "heroDescription"        TEXT NOT NULL DEFAULT 'Refined works on premium linen canvas, defined by deliberate palette knife technique and expressive brushwork.',
  ADD COLUMN IF NOT EXISTS "featuredWorksTitle"     TEXT NOT NULL DEFAULT 'Featured Works',
  ADD COLUMN IF NOT EXISTS "featuredWorksSubtitle"  TEXT NOT NULL DEFAULT 'Original Paintings',
  ADD COLUMN IF NOT EXISTS "printsTitle"            TEXT NOT NULL DEFAULT 'Limited Edition Prints',
  ADD COLUMN IF NOT EXISTS "printsSubtitle"         TEXT NOT NULL DEFAULT 'High-Quality Reproductions',
  ADD COLUMN IF NOT EXISTS "ctaTitle"               TEXT NOT NULL DEFAULT 'Ready to Commission?',
  ADD COLUMN IF NOT EXISTS "ctaDescription"         TEXT NOT NULL DEFAULT 'I work with collectors and designers worldwide to create bespoke artwork tailored to your vision and space.',
  ADD COLUMN IF NOT EXISTS "newsletterTitle"        TEXT NOT NULL DEFAULT 'Stay Updated',
  ADD COLUMN IF NOT EXISTS "newsletterSubtitle"     TEXT NOT NULL DEFAULT 'Subscribe to receive updates about new artworks, exhibitions, and commission opportunities.',
  ADD COLUMN IF NOT EXISTS "footerTagline"          TEXT NOT NULL DEFAULT 'Contemporary Art · Toronto, Canada',
  ADD COLUMN IF NOT EXISTS "socialLinks"            TEXT NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "commissionsSubtitle"    TEXT NOT NULL DEFAULT 'I work with collectors and designers worldwide to create bespoke artwork tailored to your vision and space.',
  ADD COLUMN IF NOT EXISTS "commissionSteps"        TEXT NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "commissionFaqs"         TEXT NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "commissionFormHelpText" TEXT NOT NULL DEFAULT 'I typically respond within 48 hours. Looking forward to collaborating with you!',
  ADD COLUMN IF NOT EXISTS "practiceCards"          TEXT NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "galleryLabel"           TEXT NOT NULL DEFAULT 'Portfolio',
  ADD COLUMN IF NOT EXISTS "galleryTitle"           TEXT NOT NULL DEFAULT 'Artworks',
  ADD COLUMN IF NOT EXISTS "gallerySubtitle"        TEXT NOT NULL DEFAULT 'Explore original paintings and limited edition prints',
  ADD COLUMN IF NOT EXISTS "navLogoSubtext"         TEXT NOT NULL DEFAULT 'Studio',
  ADD COLUMN IF NOT EXISTS "portfolioTitle"         TEXT NOT NULL DEFAULT 'Portfolio',
  ADD COLUMN IF NOT EXISTS "portfolioSubtitle"      TEXT NOT NULL DEFAULT 'A curated selection of original works',
  ADD COLUMN IF NOT EXISTS "portfolioStatement"     TEXT NOT NULL DEFAULT 'Each painting is a meditation on color, form, and the expressive potential of oil on linen. These selected works represent the breadth of my practice — from intimate studies to large-scale statements.';

-- CreateTable CommissionInquiry
CREATE TABLE IF NOT EXISTS "CommissionInquiry" (
    "id"        TEXT NOT NULL,
    "name"      TEXT NOT NULL,
    "email"     TEXT NOT NULL,
    "vision"    TEXT NOT NULL,
    "size"      TEXT NOT NULL,
    "budget"    TEXT NOT NULL,
    "status"    TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommissionInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable NewsletterSubscriber
CREATE TABLE IF NOT EXISTS "NewsletterSubscriber" (
    "id"        TEXT NOT NULL,
    "email"     TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex (unique email)
CREATE UNIQUE INDEX IF NOT EXISTS "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");
