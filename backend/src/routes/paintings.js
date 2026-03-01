import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all available paintings (public)
router.get('/', async (req, res) => {
  const paintings = await prisma.painting.findMany({
    orderBy: { createdAt: 'desc' },
    include: { collection: { select: { id: true, name: true } } },
  });
  res.json(paintings);
});

// Get single painting
router.get('/:id', async (req, res) => {
  const painting = await prisma.painting.findUnique({
    where: { id: req.params.id },
    include: { collection: { select: { id: true, name: true } } },
  });
  if (!painting) return res.status(404).json({ error: 'Not found' });
  res.json(painting);
});

// Create painting (admin)
router.post('/', async (req, res) => {
  const key = req.headers['x-admin-key'];
  if (key !== process.env.ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });
  const painting = await prisma.painting.create({ data: req.body });
  res.json(painting);
});

// Update painting (admin)
router.put('/:id', async (req, res) => {
  const key = req.headers['x-admin-key'];
  if (key !== process.env.ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });
  const painting = await prisma.painting.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(painting);
});

// Delete painting (admin)
router.delete('/:id', async (req, res) => {
  const key = req.headers['x-admin-key'];
  if (key !== process.env.ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });
  await prisma.painting.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

// Seed endpoint (no auth, for initial data)
router.post('/seed', async (req, res) => {
  const painting = await prisma.painting.create({ data: req.body });
  res.json(painting);
});

export default router;
