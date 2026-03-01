import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

function auth(req, res, next) {
  if (req.headers['x-admin-key'] !== process.env.ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

// All paintings including sold
router.get('/paintings/all', auth, async (req, res) => {
  const paintings = await prisma.painting.findMany({
    orderBy: { createdAt: 'desc' },
    include: { collection: { select: { id: true, name: true } } },
  });
  res.json(paintings);
});

// All orders
router.get('/orders/all', auth, async (req, res) => {
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

export default router;
