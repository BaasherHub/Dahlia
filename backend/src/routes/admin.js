import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

export function requireAdmin(req, res, next) {
  const key = req.headers['x-admin-key'];
  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// GET all paintings including sold (admin)
router.get('/paintings/all', requireAdmin, async (req, res) => {
  const paintings = await prisma.painting.findMany({
    orderBy: { createdAt: 'desc' },
    include: { collection: true },
  });
  res.json(paintings);
});

// GET all orders (admin)
router.get('/orders/all', requireAdmin, async (req, res) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { painting: true },
      },
    },
  });
  res.json(orders);
});

export default router;
