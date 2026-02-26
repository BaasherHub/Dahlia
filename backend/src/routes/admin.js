// src/routes/admin.js
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const auth = (req, res, next) => {
  if (req.headers['x-admin-key'] !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// GET /api/paintings/all — all paintings including sold (admin only)
router.get('/paintings/all', auth, async (req, res) => {
  const paintings = await prisma.painting.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(paintings);
});

// GET /api/orders/all — all orders (admin only)
router.get('/orders/all', auth, async (req, res) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { painting: true } } },
  });
  res.json(orders);
});

export default router;
