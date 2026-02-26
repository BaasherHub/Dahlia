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

// POST /api/paintings/seed — adds sample paintings (only works if gallery is empty)
router.post('/seed', async (req, res) => {
  const count = await prisma.painting.count();
  if (count > 0) return res.json({ message: `Already have ${count} paintings, skipping.` });

  await prisma.painting.createMany({
    data: [
      {
        title: 'Golden Hour',
        description: 'A warm luminous landscape painted in layers of amber and gold.',
        price: 1200,
        images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800'],
        dimensions: '80 x 100 cm',
        medium: 'Oil on canvas',
        year: 2024,
        featured: true,
      },
      {
        title: 'Still Life with Pomegranates',
        description: 'Rich crimson tones set against a warm neutral ground.',
        price: 850,
        images: ['https://images.unsplash.com/photo-1549490349-8643362247b5?w=800'],
        dimensions: '60 x 70 cm',
        medium: 'Oil on linen',
        year: 2024,
        featured: true,
      },
      {
        title: 'Quiet Interior',
        description: 'Morning light filters through sheer curtains onto a pale room.',
        price: 980,
        images: ['https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800'],
        dimensions: '70 x 70 cm',
        medium: 'Oil on canvas',
        year: 2023,
        featured: true,
      },
    ],
  });
  res.json({ message: 'Seeded 3 sample paintings!' });
});

// GET /api/paintings/:id
router.get('/:id', async (req, res) => {
  const painting = await prisma.painting.findUnique({
    where: { id: req.params.id },
  });
  if (!painting) return res.status(404).json({ error: 'Painting not found' });
  res.json(painting);
});

// POST /api/paintings — add a painting
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
