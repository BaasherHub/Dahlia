import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from './admin.js';

const router = Router();
const prisma = new PrismaClient();

// GET all paintings including sold (admin) - must be before /:id
router.get('/all', requireAdmin, async (req, res) => {
  const paintings = await prisma.painting.findMany({
    orderBy: { createdAt: 'desc' },
    include: { collection: true },
  });
  res.json(paintings);
});

// GET hero painting - must be before /:id
router.get('/hero', async (req, res) => {
  const painting = await prisma.painting.findFirst({
    where: { heroImage: true },
  });
  res.json(painting || null);
});

// GET all available paintings (public)
router.get('/', async (req, res) => {
  const { collectionId } = req.query;
  const where = {};
  if (collectionId) where.collectionId = collectionId;
  
  const paintings = await prisma.painting.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { collection: { select: { id: true, name: true } } },
  });
  res.json(paintings);
});

// GET single painting
router.get('/:id', async (req, res) => {
  const painting = await prisma.painting.findUnique({
    where: { id: req.params.id },
    include: { collection: { select: { id: true, name: true } } },
  });
  if (!painting) return res.status(404).json({ error: 'Not found' });
  res.json(painting);
});

// POST create painting (admin)
router.post('/', requireAdmin, async (req, res) => {
  const {
    title, description, originalPrice, originalAvailable,
    printPrice, printAvailable, images, dimensions, medium,
    year, featured, heroImage, category, collectionId
  } = req.body;

  // If setting as hero, unset others
  if (heroImage) {
    await prisma.painting.updateMany({ data: { heroImage: false } });
  }

  const painting = await prisma.painting.create({
    data: {
      title,
      description: description || '',
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      originalAvailable: originalAvailable !== false,
      printPrice: printPrice ? parseFloat(printPrice) : null,
      printAvailable: printAvailable === true,
      images: images || [],
      dimensions: dimensions || '',
      medium: medium || 'Oil on canvas',
      year: year ? parseInt(year) : new Date().getFullYear(),
      featured: featured || false,
      heroImage: heroImage || false,
      category: category || 'original',
      collectionId: collectionId || null,
    },
  });
  res.json(painting);
});

// PUT update painting (admin)
router.put('/:id', requireAdmin, async (req, res) => {
  const {
    title, description, originalPrice, originalAvailable,
    printPrice, printAvailable, images, dimensions, medium,
    year, featured, heroImage, sold, category, collectionId
  } = req.body;

  // If setting as hero, unset others first
  if (heroImage) {
    await prisma.painting.updateMany({ data: { heroImage: false } });
  }

  const painting = await prisma.painting.update({
    where: { id: req.params.id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(originalPrice !== undefined && { originalPrice: originalPrice ? parseFloat(originalPrice) : null }),
      ...(originalAvailable !== undefined && { originalAvailable }),
      ...(printPrice !== undefined && { printPrice: printPrice ? parseFloat(printPrice) : null }),
      ...(printAvailable !== undefined && { printAvailable }),
      ...(images !== undefined && { images }),
      ...(dimensions !== undefined && { dimensions }),
      ...(medium !== undefined && { medium }),
      ...(year !== undefined && { year: parseInt(year) }),
      ...(featured !== undefined && { featured }),
      ...(heroImage !== undefined && { heroImage }),
      ...(sold !== undefined && { sold }),
      ...(category !== undefined && { category }),
      ...(collectionId !== undefined && { collectionId: collectionId || null }),
    },
  });
  res.json(painting);
});

// DELETE painting (admin)
router.delete('/:id', requireAdmin, async (req, res) => {
  await prisma.painting.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

export default router;
