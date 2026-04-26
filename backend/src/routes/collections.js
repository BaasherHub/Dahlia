import { Router } from 'express';
import { z } from 'zod';
import { requireAdmin } from './admin.js';
import prisma from '../lib/prisma.js';

const router = Router();

const CreateCollectionSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  coverImage: z.string().url().nullable().optional(),
  coverImages: z.array(z.string().url()).max(24).optional(),
  order: z.number().int().default(0),
});

function normalizeCovers(data) {
  const imgs =
    data.coverImages?.length > 0
      ? data.coverImages
      : data.coverImage
        ? [data.coverImage]
        : [];
  return {
    ...data,
    coverImage: imgs[0] ?? null,
    coverImages: imgs,
  };
}

const UpdateCollectionSchema = CreateCollectionSchema.partial();

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

router.get('/:id', async (req, res) => {
  const collection = await prisma.collection.findUnique({
    where: { id: req.params.id },
    include: {
      paintings: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  if (!collection) {
    return res.status(404).json({ error: 'Collection not found' });
  }
  res.json(collection);
});

router.post('/', requireAdmin, async (req, res) => {
  const parsed = CreateCollectionSchema.parse(req.body);
  const data = normalizeCovers(parsed);
  const collection = await prisma.collection.create({ data });
  res.status(201).json(collection);
});

router.put('/:id', requireAdmin, async (req, res) => {
  const parsed = UpdateCollectionSchema.parse(req.body);
  const hasCover =
    parsed.coverImages !== undefined ||
    parsed.coverImage !== undefined;
  const data = hasCover ? normalizeCovers(parsed) : parsed;
  const collection = await prisma.collection.update({
    where: { id: req.params.id },
    data,
  });
  res.json(collection);
});

router.delete('/:id', requireAdmin, async (req, res) => {
  await prisma.collection.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

export default router;
