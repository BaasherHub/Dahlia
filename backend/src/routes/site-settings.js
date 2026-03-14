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

// GET /api/site-settings — public (for About page + Testimonials)
router.get('/', async (req, res) => {
  try {
    const settings = await ensureSettings();
    // Parse testimonials JSON
    let testimonials = [];
    try {
      testimonials = JSON.parse(settings.testimonials || '[]');
    } catch { testimonials = []; }

    res.json({
      aboutHeroSubtitle: settings.aboutHeroSubtitle,
      aboutBio1: settings.aboutBio1,
      aboutBio2: settings.aboutBio2,
      aboutBio3: settings.aboutBio3,
      aboutStatement1: settings.aboutStatement1,
      aboutStatement2: settings.aboutStatement2,
      aboutStatement3: settings.aboutStatement3,
      testimonials,
    });
  } catch (error) {
    logError({ message: 'Error fetching site settings', error: error.message });
    res.status(500).json({ error: 'Failed to fetch site settings' });
  }
});

// PUT /api/site-settings — admin only
router.put('/', requireAdmin, async (req, res) => {
  try {
    const {
      aboutHeroSubtitle,
      aboutBio1, aboutBio2, aboutBio3,
      aboutStatement1, aboutStatement2, aboutStatement3,
      testimonials,
    } = req.body;

    const data = {};
    if (aboutHeroSubtitle !== undefined) data.aboutHeroSubtitle = aboutHeroSubtitle;
    if (aboutBio1 !== undefined) data.aboutBio1 = aboutBio1;
    if (aboutBio2 !== undefined) data.aboutBio2 = aboutBio2;
    if (aboutBio3 !== undefined) data.aboutBio3 = aboutBio3;
    if (aboutStatement1 !== undefined) data.aboutStatement1 = aboutStatement1;
    if (aboutStatement2 !== undefined) data.aboutStatement2 = aboutStatement2;
    if (aboutStatement3 !== undefined) data.aboutStatement3 = aboutStatement3;
    if (testimonials !== undefined) data.testimonials = JSON.stringify(testimonials);

    await ensureSettings();
    const updated = await prisma.siteSettings.update({
      where: { id: 'singleton' },
      data,
    });

    let parsedTestimonials = [];
    try { parsedTestimonials = JSON.parse(updated.testimonials || '[]'); } catch {}

    logInfo('Site settings updated');

    res.json({
      aboutHeroSubtitle: updated.aboutHeroSubtitle,
      aboutBio1: updated.aboutBio1,
      aboutBio2: updated.aboutBio2,
      aboutBio3: updated.aboutBio3,
      aboutStatement1: updated.aboutStatement1,
      aboutStatement2: updated.aboutStatement2,
      aboutStatement3: updated.aboutStatement3,
      testimonials: parsedTestimonials,
    });
  } catch (error) {
    logError({ message: 'Error updating site settings', error: error.message });
    res.status(500).json({ error: 'Failed to update site settings' });
  }
});

export default router;
