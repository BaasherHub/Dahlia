import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { alertAdmin } from '../services/alert.js';
import { logError } from '../services/logger.js';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Too many contact attempts. Please try again later.',
});

const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(5000),
});

router.post('/', contactLimiter, async (req, res) => {
  try {
    const data = ContactSchema.parse(req.body);

    await alertAdmin(
      `Contact Form: ${data.subject}`,
      `<strong>From:</strong> ${data.name} &lt;${data.email}&gt;<br><br><strong>Message:</strong><br>${data.message.replace(/\n/g, '<br>')}`
    );

    res.json({ ok: true, message: 'Message sent. We\'ll be in touch soon.' });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Please fill in all fields correctly.', details: error.errors });
    }
    logError({ message: 'Contact form failed', error: error.message });
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

export default router;
