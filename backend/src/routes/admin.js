import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { logInfo, logError } from '../services/logger.js';
import prisma from '../lib/prisma.js';

const router = Router();

// Admin authentication middleware
export function requireAdmin(req, res, next) {
  const key = (req.headers['x-admin-key'] || '').trim();

  if (!key) {
    logInfo('Admin request without key', { path: req.path });
    return res.status(401).json({ error: 'Missing admin key' });
  }

  const expectedKey = (process.env.ADMIN_KEY || '').trim();
  const keyMatch = key === expectedKey;

  if (!keyMatch) {
    logInfo('Invalid admin key attempt', {
      providedKeyLength: key.length,
      expectedKeyLength: expectedKey?.length || 0,
      match: keyMatch,
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

// Verify admin access (for frontend)
router.get('/verify', requireAdmin, (req, res) => {
  res.json({ authenticated: true });
});

// GET dashboard stats
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const [
    totalPaintings,
    totalOrders,
    totalRevenue,
    recentOrders,
    pendingInquiries,
  ] = await Promise.all([
        prisma.painting.count(),
        prisma.order.count(),
        prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: 'CANCELLED' } } }),
        prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { items: { include: { painting: { select: { title: true } } } } },
        }),
        prisma.commissionInquiry.count({ where: { status: 'new' } }),
      ]);

    res.json({
      totalPaintings,
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      recentOrders,
      pendingInquiries,
    });
  } catch (error) {
    logError({ message: 'Error fetching admin stats', error: error.message });
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

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
    logError({ message: 'Error fetching admin orders', error: error.message });
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET single order (admin)
router.get('/orders/:id', requireAdmin, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: { include: { painting: true } } },
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    logError({ message: 'Error fetching order', error: error.message, orderId: req.params.id });
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// PUT update order (admin) — status + tracking
router.put('/orders/:id', requireAdmin, async (req, res) => {
  try {
    const { status, trackingCode, carrier } = req.body;
    const validStatuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    const data = {};
    if (status !== undefined) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      data.status = status;
    }
    if (trackingCode !== undefined) data.trackingCode = trackingCode || null;
    if (carrier !== undefined) data.carrier = carrier || null;

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data,
      include: { items: { include: { painting: { select: { id: true, title: true } } } } },
    });

    logInfo('Order updated', { orderId: req.params.id, status, trackingCode });
    res.json(order);
  } catch (error) {
    logError({ message: 'Error updating order', error: error.message, orderId: req.params.id });
    res.status(500).json({ error: 'Failed to update order' });
  }
});

export default router;

