import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const heroSlideSchema = z.object({
  image: z.string().min(1),
  title: z.string().min(2),
  subtitle: z.string().min(3),
  sortOrder: z.coerce.number().int().optional(),
});

type HeroSlideRow = {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

router.get('/', async (_req, res, next) => {
  try {
    const slides = await prisma.$queryRaw<HeroSlideRow[]>`
      SELECT id, image, title, subtitle, "sortOrder", "createdAt", "updatedAt"
      FROM "HeroSlide"
      ORDER BY "sortOrder" ASC, "createdAt" ASC
    `;
    res.json(slides);
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const data = heroSlideSchema.parse(req.body);
    const id = crypto.randomUUID();
    await prisma.$executeRaw`
      INSERT INTO "HeroSlide" (id, image, title, subtitle, "sortOrder", "createdAt", "updatedAt")
      VALUES (${id}, ${data.image}, ${data.title}, ${data.subtitle}, ${data.sortOrder ?? 0}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    const [slide] = await prisma.$queryRaw<HeroSlideRow[]>`
      SELECT id, image, title, subtitle, "sortOrder", "createdAt", "updatedAt"
      FROM "HeroSlide"
      WHERE id = ${id}
    `;
    res.status(201).json(slide);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const data = heroSlideSchema.partial().parse(req.body);
    await prisma.$executeRaw`
      UPDATE "HeroSlide"
      SET
        image = COALESCE(${data.image ?? null}, image),
        title = COALESCE(${data.title ?? null}, title),
        subtitle = COALESCE(${data.subtitle ?? null}, subtitle),
        "sortOrder" = COALESCE(${data.sortOrder ?? null}, "sortOrder"),
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;
    const [slide] = await prisma.$queryRaw<HeroSlideRow[]>`
      SELECT id, image, title, subtitle, "sortOrder", "createdAt", "updatedAt"
      FROM "HeroSlide"
      WHERE id = ${id}
    `;
    res.json(slide);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    await prisma.$executeRaw`
      DELETE FROM "HeroSlide"
      WHERE id = ${id}
    `;
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
