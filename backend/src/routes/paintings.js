// src/routes/paintings.js
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/paintings — list all available paintings
router.get('/', async (req, res) => {
  const { featured } = req.query;
  const paintings = await prisma.painting.findMany({
    where: {
      sold: false,
      ...(featured === 'true' ? { featured: true } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(paintings);
});

// GET /api/paintings/:id
router.get('/:id', async (req, res) => {
  const painting = await prisma.painting.findUnique({
    where: { id: req.params.id },
  });
  if (!painting) return res.status(404).json({ error: 'Painting not found' });
  res.json(painting);
});

// POST /api/paintings — add a painting (protect this in production with an admin key)
router.post('/', async (req, res) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { title, description, price, images, dimensions, medium, year, featured } = req.body;
  const painting = await prisma.painting.create({
    data: { title, description, price, images, dimensions, medium, year, featured: featured ?? false },
  });
  res.status(201).json(painting);
});

// PATCH /api/paintings/:id — update a painting
router.patch('/:id', async (req, res) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const painting = await prisma.painting.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(painting);
});

// DELETE /api/paintings/:id
router.delete('/:id', async (req, res) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  await prisma.painting.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

export default router;
