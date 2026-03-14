-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "aboutHeroSubtitle" TEXT NOT NULL DEFAULT 'Contemporary artist creating refined works on premium linen canvas',
    "aboutBio1" TEXT NOT NULL DEFAULT 'I am a contemporary artist specializing in oil paintings on premium linen canvas. My work is defined by deliberate palette knife technique and expressive brushwork, creating pieces that resonate with collectors and designers worldwide.',
    "aboutBio2" TEXT NOT NULL DEFAULT 'Each painting begins with careful consideration of color, composition, and emotional resonance. I work exclusively with the finest materials to ensure longevity and visual impact that endures through time.',
    "aboutBio3" TEXT NOT NULL DEFAULT 'My practice combines technical precision with spontaneous creativity, resulting in works that are both carefully considered and intuitively executed.',
    "aboutStatement1" TEXT NOT NULL DEFAULT 'My practice is rooted in a deep engagement with color, form, and the physical materiality of paint. I create work that exists in conversation with contemporary art practice while maintaining a reverence for the traditions of painting.',
    "aboutStatement2" TEXT NOT NULL DEFAULT 'Through careful observation and intuitive response, I build paintings that invite contemplation and emotional engagement. Each piece is an attempt to capture a moment of synthesis between intention and spontaneity, between control and surrender.',
    "aboutStatement3" TEXT NOT NULL DEFAULT 'I am committed to creating work of lasting value—both visually and materially. My practice is defined by a pursuit of excellence and a dedication to the craft of painting.',
    "testimonials" TEXT NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- Seed the singleton row
INSERT INTO "SiteSettings" ("id", "updatedAt") VALUES ('singleton', NOW())
ON CONFLICT ("id") DO NOTHING;
