import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import rateLimit from 'express-rate-limit';

const router = Router();
const prisma = new PrismaClient();

export function requireAdmin(req, res, next) {
  const key = req.headers['x-admin-key'];

  if (!key) {
    return res.status(401).json({ error: 'Missing admin key' });
  }

  if (key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Invalid admin key' });
  }

  req.isAdmin = true;
  next();
}

const adminAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skip: (req) => {
    const key = req.headers['x-admin-key'];
    return key === process.env.ADMIN_KEY;
  },
  message: 'Too many failed admin attempts. Please try again later.',
});

router.use(adminAuthLimiter);

router.get('/orders', requireAdmin, async (req, res) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { painting: { select: { id: true, title: true } } },
      },
    },
  });
  res.json(orders);
});

router.get('/orders/:id', requireAdmin, async (req, res) => {
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
});

export default router;
