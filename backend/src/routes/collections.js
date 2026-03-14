import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { requireAdmin } from './admin.js';

const router = Router();
const prisma = new PrismaClient();

const CreateCollectionSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  coverImage: z.string().url().nullable().optional(),
  order: z.number().int().default(0),
});

const UpdateCollectionSchema = CreateCollectionSchema.partial();

router.get('/', async (req, res) => {
  const collections = await prisma.collection.findMany({
    orderBy: { order: 'asc' },
    include: {
      paintings: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        where: { originalAvailable: true },
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
        where: { originalAvailable: true },
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
  const data = CreateCollectionSchema.parse(req.body);
  const collection = await prisma.collection.create({ data });
  res.status(201).json(collection);
});

router.put('/:id', requireAdmin, async (req, res) => {
  const data = UpdateCollectionSchema.parse(req.body);
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
