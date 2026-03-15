import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from './admin.js';
import { logInfo, logError } from '../services/logger.js';

const router = Router();
const prisma = new PrismaClient();

// Ensure the singleton row exists
async function ensureSettings() {
  let settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: { id: 'singleton' } });
  }
  return settings;
}

// Helper to safely parse a JSON field into an array
function parseJson(value, fallback = []) {
  try { return JSON.parse(value || JSON.stringify(fallback)); } catch { return fallback; }
}

// Build the full response object from a settings record
function buildResponse(s) {
  return {
    // About page
    aboutHeroSubtitle: s.aboutHeroSubtitle,
    aboutBio1: s.aboutBio1,
    aboutBio2: s.aboutBio2,
    aboutBio3: s.aboutBio3,
    aboutStatement1: s.aboutStatement1,
    aboutStatement2: s.aboutStatement2,
    aboutStatement3: s.aboutStatement3,
    testimonials: parseJson(s.testimonials, []),

    // Homepage
    heroTitle: s.heroTitle,
    heroSubtitle: s.heroSubtitle,
    heroDescription: s.heroDescription,
    featuredWorksTitle: s.featuredWorksTitle,
    featuredWorksSubtitle: s.featuredWorksSubtitle,
    printsTitle: s.printsTitle,
    printsSubtitle: s.printsSubtitle,
    ctaTitle: s.ctaTitle,
    ctaDescription: s.ctaDescription,
    newsletterTitle: s.newsletterTitle,
    newsletterSubtitle: s.newsletterSubtitle,

    // Footer
    footerTagline: s.footerTagline,
    socialLinks: parseJson(s.socialLinks, []),

    // Commissions page
    commissionsSubtitle: s.commissionsSubtitle,
    commissionSteps: parseJson(s.commissionSteps, []),
    commissionFaqs: parseJson(s.commissionFaqs, []),
    commissionFormHelpText: s.commissionFormHelpText,

    // About practice cards
    practiceCards: parseJson(s.practiceCards, []),

    // Gallery page
    galleryLabel: s.galleryLabel,
    galleryTitle: s.galleryTitle,
    gallerySubtitle: s.gallerySubtitle,

    // Navigation
    navLogoSubtext: s.navLogoSubtext,

    // Portfolio page
    portfolioTitle: s.portfolioTitle,
    portfolioSubtitle: s.portfolioSubtitle,
    portfolioStatement: s.portfolioStatement,
  };
}

// GET /api/site-settings — public
router.get('/', async (req, res) => {
  try {
    const settings = await ensureSettings();
    res.json(buildResponse(settings));
  } catch (error) {
    logError({ message: 'Error fetching site settings', error: error.message });
    res.status(500).json({ error: 'Failed to fetch site settings' });
  }
});

// PUT /api/site-settings — admin only (accepts partial updates)
router.put('/', requireAdmin, async (req, res) => {
  try {
    const body = req.body;
    const data = {};

    // String fields (direct mapping)
    const stringFields = [
      'aboutHeroSubtitle', 'aboutBio1', 'aboutBio2', 'aboutBio3',
      'aboutStatement1', 'aboutStatement2', 'aboutStatement3',
      'heroTitle', 'heroSubtitle', 'heroDescription',
      'featuredWorksTitle', 'featuredWorksSubtitle',
      'printsTitle', 'printsSubtitle',
      'ctaTitle', 'ctaDescription',
      'newsletterTitle', 'newsletterSubtitle',
      'footerTagline',
      'commissionsSubtitle', 'commissionFormHelpText',
      'galleryLabel', 'galleryTitle', 'gallerySubtitle',
      'navLogoSubtext',
      'portfolioTitle', 'portfolioSubtitle', 'portfolioStatement',
    ];
    for (const field of stringFields) {
      if (body[field] !== undefined) data[field] = body[field];
    }

    // JSON array fields (serialised to string)
    const jsonFields = [
      'testimonials', 'socialLinks',
      'commissionSteps', 'commissionFaqs', 'practiceCards',
    ];
    for (const field of jsonFields) {
      if (body[field] !== undefined) data[field] = JSON.stringify(body[field]);
    }

    await ensureSettings();
    const updated = await prisma.siteSettings.update({
      where: { id: 'singleton' },
      data,
    });

    logInfo('Site settings updated');
    res.json(buildResponse(updated));
  } catch (error) {
    logError({ message: 'Error updating site settings', error: error.message });
    res.status(500).json({ error: 'Failed to update site settings' });
  }
});

export default router;
