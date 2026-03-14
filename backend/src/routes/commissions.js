import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { logInfo, logError } from '../services/logger.js';
import { alertAdmin } from '../services/alert.js';

const router = Router();

const commissionLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: 'Too many requests.' });

const CommissionSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  vision: z.string().min(20).max(5000),
  size: z.string().min(1).max(100),
  budget: z.string().min(1).max(50),
});

router.post('/', commissionLimiter, async (req, res) => {
  try {
    const data = CommissionSchema.parse(req.body);
    logInfo('New commission inquiry', { name: data.name, email: data.email, budget: data.budget });
    await alertAdmin(`New Commission from ${data.name}`, `<strong>Email:</strong> ${data.email}<br><strong>Budget:</strong> ${data.budget}<br><strong>Size:</strong> ${data.size}<br><strong>Vision:</strong><br>${data.vision}`);
    res.json({ ok: true, message: 'Inquiry received' });
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json({ error: 'Validation error', details: error.errors });
    logError({ message: 'Commission submission failed', error: error.message });
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

export default router;
