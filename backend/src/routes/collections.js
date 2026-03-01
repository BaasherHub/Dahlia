import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all collections (public)
router.get('/', async (req, res) => {
  const collections = await prisma.collection.findMany({
    orderBy: { order: 'asc' },
    include: {
      paintings: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        select: { id: true, images: true, title: true },
      },
      _count: { select: { paintings: true } },
    },
  });
  res.json(collections);
});

// Get single collection with all paintings
router.get('/:id', async (req, res) => {
  const collection = await prisma.collection.findUnique({
    where: { id: req.params.id },
    include: {
      paintings: { orderBy: { createdAt: 'desc' } },
    },
  });
  if (!collection) return res.status(404).json({ error: 'Not found' });
  res.json(collection);
});

// Create collection (admin)
router.post('/', async (req, res) => {
  const key = req.headers['x-admin-key'];
  if (key !== process.env.ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });
  const collection = await prisma.collection.create({ data: req.body });
  res.json(collection);
});

// Update collection (admin)
router.put('/:id', async (req, res) => {
  const key = req.headers['x-admin-key'];
  if (key !== process.env.ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });
  const collection = await prisma.collection.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(collection);
});

// Delete collection (admin)
router.delete('/:id', async (req, res) => {
  const key = req.headers['x-admin-key'];
  if (key !== process.env.ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });
  await prisma.collection.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

export default router;
