import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { logInfo, logError } from '../services/logger.js';

const router = Router();

const subscribeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Too many subscribe attempts. Please try again later.',
});

const SubscribeSchema = z.object({
  email: z.string().email(),
});

// In-memory store (replace with DB table in production)
const subscribers = new Set();

router.post('/subscribe', subscribeLimiter, async (req, res) => {
  try {
    const { email } = SubscribeSchema.parse(req.body);

    if (subscribers.has(email)) {
      return res.status(409).json({ error: 'Already subscribed' });
    }

    subscribers.add(email);
    logInfo('New newsletter subscriber', { email });

    res.json({ ok: true, message: 'Subscribed successfully' });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid email' });
    }
    logError({ message: 'Newsletter subscription failed', error: error.message });
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

export default router;
