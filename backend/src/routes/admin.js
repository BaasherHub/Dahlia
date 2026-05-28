import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { logInfo, logError } from '../services/logger.js';
import {
  verifyAdminKey,
  setSessionCookie,
  clearSessionCookie,
  isRequestAdmin,
} from '../services/adminSession.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import prisma from '../lib/prisma.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts. Please try again later.',
});

router.post('/login', loginLimiter, (req, res) => {
  const key = (req.body?.key || '').trim();
  if (!verifyAdminKey(key)) {
    logInfo('Failed admin login attempt');
    return res.status(401).json({ error: 'Invalid admin key' });
  }
  setSessionCookie(res);
  logInfo('Admin logged in');
  res.json({ ok: true });
});

router.post('/logout', (req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

const adminAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip: (req) => isRequestAdmin(req),
  message: 'Too many requests, please try again later.',
});

router.use(adminAuthLimiter);

router.get('/verify', requireAdmin, (req, res) => {
  res.json({ authenticated: true });
});

router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const [totalPaintings, totalOrders, totalRevenue, recentOrders, pendingInquiries] =
      await Promise.all([
        prisma.painting.count(),
        prisma.order.count(),
        prisma.order.aggregate({
          _sum: { total: true },
          where: { status: { not: 'CANCELLED' } },
        }),
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

router.get('/commissions', requireAdmin, async (req, res) => {
  try {
    const inquiries = await prisma.commissionInquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(inquiries);
  } catch (error) {
    logError({ message: 'Error fetching commissions', error: error.message });
    res.status(500).json({ error: 'Failed to fetch commissions' });
  }
});

router.patch('/commissions/:id', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['new', 'read', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be new, read, or archived.' });
    }
    const inquiry = await prisma.commissionInquiry.update({
      where: { id: req.params.id },
      data: { status },
    });
    logInfo('Commission inquiry updated', { id: req.params.id, status });
    res.json(inquiry);
  } catch (error) {
    logError({ message: 'Error updating commission inquiry', error: error.message, id: req.params.id });
    res.status(500).json({ error: 'Failed to update inquiry' });
  }
});

export default router;
