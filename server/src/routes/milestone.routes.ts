import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const milestoneSchema = z.object({
  year: z.string().min(2),
  title: z.string().min(2),
  description: z.string().min(10),
  sortOrder: z.coerce.number().int().optional(),
});

router.get('/', async (_req, res, next) => {
  try {
    const milestones = await prisma.milestone.findMany({ orderBy: [{ sortOrder: 'asc' }, { year: 'asc' }] });
    res.json(milestones);
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const data = milestoneSchema.parse(req.body);
    const milestone = await prisma.milestone.create({
      data: { ...data, sortOrder: data.sortOrder ?? 0 },
    });
    res.status(201).json(milestone);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const data = milestoneSchema.partial().parse(req.body);
    const milestone = await prisma.milestone.update({ where: { id }, data });
    res.json(milestone);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    await prisma.milestone.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
