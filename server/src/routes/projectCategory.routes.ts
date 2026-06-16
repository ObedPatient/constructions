import { Router } from 'express';
import slugify from 'slugify';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { AppError } from '../utils/errors.js';

const router = Router();

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
});

function makeSlug(value: string) {
  return slugify(value, { lower: true, strict: true });
}

router.get('/', async (_req, res, next) => {
  try {
    const categories = await prisma.projectCategory.findMany({ orderBy: { name: 'asc' } });
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const data = categorySchema.parse(req.body);
    const slug = data.slug ? makeSlug(data.slug) : makeSlug(data.name);

    const category = await prisma.projectCategory.create({
      data: { name: data.name, slug },
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const data = categorySchema.partial().parse(req.body);
    const current = await prisma.projectCategory.findUniqueOrThrow({ where: { id } });
    const nextSlug = data.slug ? makeSlug(data.slug) : data.name ? makeSlug(data.name) : current.slug;

    const category = await prisma.$transaction(async (tx) => {
      const updated = await tx.projectCategory.update({
        where: { id },
        data: {
          name: data.name,
          slug: nextSlug,
        },
      });

      if (updated.slug !== current.slug) {
        await tx.project.updateMany({
          where: { category: current.slug },
          data: { category: updated.slug },
        });
      }

      return updated;
    });

    res.json(category);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const category = await prisma.projectCategory.findUniqueOrThrow({ where: { id } });
    const projectCount = await prisma.project.count({ where: { category: category.slug } });

    if (projectCount > 0) {
      throw new AppError(400, 'Cannot delete a category that is used by projects');
    }

    await prisma.projectCategory.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
