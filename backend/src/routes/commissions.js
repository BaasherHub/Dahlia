import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { logInfo, logError } from '../services/logger.js';
import { alertAdmin } from '../services/alert.js';
import { requireAdmin } from './admin.js';

const router = Router();
const prisma = new PrismaClient();

const commissionLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: 'Too many requests.' });

const CommissionSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  vision: z.string().min(20).max(5000),
  size: z.string().min(1).max(100),
  budget: z.string().min(1).max(50),
});

// POST /api/commissions — public (rate-limited)
router.post('/', commissionLimiter, async (req, res) => {
  try {
    const data = CommissionSchema.parse(req.body);
    logInfo('New commission inquiry', { name: data.name, email: data.email, budget: data.budget });

    // Persist to database
    await prisma.commissionInquiry.create({
      data: {
        name: data.name,
        email: data.email,
        vision: data.vision,
        size: data.size,
        budget: data.budget,
      },
    });

    await alertAdmin(`New Commission from ${data.name}`, `<strong>Email:</strong> ${data.email}<br><strong>Budget:</strong> ${data.budget}<br><strong>Size:</strong> ${data.size}<br><strong>Vision:</strong><br>${data.vision}`);
    res.json({ ok: true, message: 'Inquiry received' });
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json({ error: 'Validation error', details: error.errors });
    logError({ message: 'Commission submission failed', error: error.message });
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

// GET /api/commissions — admin only
router.get('/', requireAdmin, async (req, res) => {
  try {
    const inquiries = await prisma.commissionInquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(inquiries);
  } catch (error) {
    logError({ message: 'Error fetching commission inquiries', error: error.message });
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// PUT /api/commissions/:id — admin only (update status)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['new', 'contacted', 'completed', 'declined'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const updated = await prisma.commissionInquiry.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(updated);
  } catch (error) {
    logError({ message: 'Error updating commission inquiry', error: error.message });
    res.status(500).json({ error: 'Failed to update inquiry' });
  }
});

export default router;
