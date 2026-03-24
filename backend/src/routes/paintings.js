import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { requireAdmin } from './admin.js';
import prisma from '../lib/prisma.js';

const router = Router();

const emptyStringToNull = (value) => {
  if (typeof value === 'string' && value.trim() === '') {
    return null;
  }
  return value;
};

const CreatePaintingSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(2000).default(''),
  originalPrice: z.number().positive().nullable().optional(),
  originalAvailable: z.boolean().default(true),
  printPrice: z.number().positive().nullable().optional(),
  printAvailable: z.boolean().default(false),
  images: z.array(z.string().url()).min(1),
  dimensions: z.string().min(1).max(100),
  medium: z.string().max(100).default('Oil on canvas'),
  year: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  sold: z.boolean().default(false),
  featured: z.boolean().default(false),
  heroImage: z.boolean().default(false),
  category: z.enum(['original', 'print', 'both']).default('original'),
  collectionId: z.preprocess(emptyStringToNull, z.string().nullable().optional()),
});

const UpdatePaintingSchema = CreatePaintingSchema.partial().extend({
  images: z.preprocess(
    (value) => (Array.isArray(value) && value.length === 0 ? undefined : value),
    z.array(z.string().url()).min(1).optional()
  ),
  collectionId: z.preprocess(emptyStringToNull, z.string().nullable().optional()),
});

const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  collectionId: z.string().optional(),
  featured: z.preprocess(
    (v) => v === 'true' || v === true,
    z.boolean().optional()
  ),
  category: z.enum(['original', 'print', 'both']).optional(),
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip: (req) => process.env.NODE_ENV !== 'production',
  message: 'Too many requests, please try again later.',
});

router.use(adminLimiter);

// GET all paintings (admin - includes sold) - must be before /:id
router.get('/all', requireAdmin, async (req, res) => {
  const { page, limit } = PaginationSchema.parse(req.query);
  const skip = (page - 1) * limit;

  const paintings = await prisma.painting.findMany({
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: { collection: true },
  });

  const total = await prisma.painting.count();

  res.json({
    data: paintings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
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
  const { collectionId, page, limit, featured, category } = PaginationSchema.parse(req.query);
  const skip = (page - 1) * limit;

  const availabilityFilter = category === 'original'
    ? { originalAvailable: true }
    : category === 'print'
      ? { printAvailable: true }
      : {
          OR: [
            { originalAvailable: true },
            { printAvailable: true },
          ],
        };

  const where = {
    ...availabilityFilter,
    sold: false,
    ...(collectionId && { collectionId }),
    ...(featured === true && { featured: true }),
  };

  const paintings = await prisma.painting.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: { collection: { select: { id: true, name: true } } },
  });

  const total = await prisma.painting.count({ where });

  res.json({
    data: paintings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// GET single painting
router.get('/:id', async (req, res) => {
  const painting = await prisma.painting.findUnique({
    where: { id: req.params.id },
    include: { collection: { select: { id: true, name: true } } },
  });
  if (!painting) {
    return res.status(404).json({ error: 'Painting not found' });
  }
  res.json(painting);
});

// POST create painting (admin)
router.post('/', requireAdmin, async (req, res) => {
  const data = CreatePaintingSchema.parse(req.body);

  if (data.heroImage) {
    await prisma.painting.updateMany({ data: { heroImage: false } });
  }

  const painting = await prisma.painting.create({ data });
  res.status(201).json(painting);
});

// PUT update painting (admin)
router.put('/:id', requireAdmin, async (req, res) => {
  const data = UpdatePaintingSchema.parse(req.body);

  if (data.heroImage) {
    await prisma.painting.updateMany({
      where: { id: { not: req.params.id } },
      data: { heroImage: false },
    });
  }

  const painting = await prisma.painting.update({
    where: { id: req.params.id },
    data,
  });
  res.json(painting);
});

// DELETE painting (admin)
// Deletes associated order items first, then the painting (allows full removal)
router.delete('/:id', requireAdmin, async (req, res) => {
  await prisma.orderItem.deleteMany({ where: { paintingId: req.params.id } });
  await prisma.painting.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

export default router;
