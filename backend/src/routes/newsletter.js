import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { logInfo, logError } from '../services/logger.js';
import { requireAdmin } from './admin.js';

const router = Router();
const prisma = new PrismaClient();
const subscribeLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5 });
const SubscribeSchema = z.object({ email: z.string().email() });

// POST /api/newsletter/subscribe — public (rate-limited)
router.post('/subscribe', subscribeLimiter, async (req, res) => {
  try {
    const { email } = SubscribeSchema.parse(req.body);
    await prisma.newsletterSubscriber.create({ data: { email } });
    logInfo('New newsletter subscriber', { email });
    res.json({ ok: true, message: 'Subscribed successfully' });
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json({ error: 'Invalid email' });
    // Prisma unique constraint violation
    if (error.code === 'P2002') return res.status(409).json({ error: 'Already subscribed' });
    logError({ message: 'Newsletter subscription failed', error: error.message });
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// GET /api/newsletter — admin only
router.get('/', requireAdmin, async (req, res) => {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(subscribers);
  } catch (error) {
    logError({ message: 'Error fetching newsletter subscribers', error: error.message });
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

// DELETE /api/newsletter/:id — admin only
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.newsletterSubscriber.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (error) {
    logError({ message: 'Error deleting subscriber', error: error.message });
    res.status(500).json({ error: 'Failed to delete subscriber' });
  }
});

export default router;
