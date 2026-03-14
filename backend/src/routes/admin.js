import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import rateLimit from 'express-rate-limit';
import { logInfo, logError } from '../services/logger.js';

const router = Router();
const prisma = new PrismaClient();

// Admin authentication middleware
export function requireAdmin(req, res, next) {
  const key = (req.headers['x-admin-key'] || '').trim();

  if (!key) {
    logInfo('Admin request without key', { path: req.path });
    return res.status(401).json({ error: 'Missing admin key' });
  }

  // Debug: Log the comparison (remove after testing)
  const expectedKey = (process.env.ADMIN_KEY || '').trim();
  const keyMatch = key === expectedKey;

  if (!keyMatch) {
    logInfo('Invalid admin key attempt', { 
      providedKeyLength: key.length,
      expectedKeyLength: expectedKey?.length || 0,
      match: keyMatch 
    });
    return res.status(401).json({ error: 'Invalid admin key' });
  }

  logInfo('Admin authenticated', { path: req.path });
  req.isAdmin = true;
  next();
}

// Rate limiter for admin endpoints
const adminAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  skip: (req) => {
    // Don't rate limit if key is correct
    const key = (req.headers['x-admin-key'] || '').trim();
    return key === process.env.ADMIN_KEY;
  },
  message: 'Too many failed admin attempts. Please try again later.',
});

router.use(adminAuthLimiter);

// GET all orders (admin)
router.get('/orders', requireAdmin, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { painting: { select: { id: true, title: true } } },
        },
      },
    });
    res.json(orders);
  } catch (error) {
    logError({
      message: 'Error fetching admin orders',
      error: error.message,
    });
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET single order (admin)
router.get('/orders/:id', requireAdmin, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: { include: { painting: true } },
      },
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    logError({
      message: 'Error fetching order',
      error: error.message,
      orderId: req.params.id,
    });
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Verify admin access (for frontend)
router.get('/verify', requireAdmin, (req, res) => {
  res.json({ authenticated: true });
});

export default router;
