import { Router } from 'express';
import slugify from 'slugify';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { AppError } from '../utils/errors.js';
import { uploadBuffer } from '../utils/upload.js';

const router = Router();

function isTodayOrFuture(value: string) {
  const date = new Date(`${value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return !Number.isNaN(date.getTime()) && date >= today;
}

const futureDateSchema = z.string().refine(isTodayOrFuture, 'Completion date cannot be in the past');

const projectSchema = z.object({
  title: z.string().min(3),
  slug: z.string().optional(),
  location: z.string().min(2),
  category: z.string().min(1),
  client: z.string().min(2),
  completionDate: futureDateSchema,
  description: z.string().min(10),
  shortDescription: z.string().min(5),
  images: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  status: z.enum(['completed', 'ongoing', 'upcoming']),
  value: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
  featured: z.preprocess((value) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  }, z.boolean().optional()),
});

function makeSlug(title: string) {
  return slugify(title, { lower: true, strict: true });
}

function normalizeBody(body: Record<string, unknown>) {
  return {
    ...body,
    images: typeof body.images === 'string' ? JSON.parse(body.images) : body.images,
    technologies: typeof body.technologies === 'string' ? JSON.parse(body.technologies) : body.technologies,
  };
}

async function ensureCategoryExists(category?: string) {
  if (!category) return;
  const exists = await prisma.projectCategory.findUnique({ where: { slug: category } });
  if (!exists) {
    throw new AppError(400, `Project category "${category}" does not exist`);
  }
}

router.get('/', async (_req, res, next) => {
  try {
    const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const slug = String(req.params.slug);
    const project = await prisma.project.findUniqueOrThrow({ where: { slug } });
    res.json(project);
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, upload.array('images', 10), async (req, res, next) => {
  try {
    const data = projectSchema.parse(normalizeBody(req.body));
    await ensureCategoryExists(data.category);
    const files = (req.files as any[]) ?? [];
    const uploadedImages = files.length
      ? await Promise.all(files.map((file) => uploadBuffer(file, 'builders-max/projects')))
      : [];
    const images = uploadedImages.length ? uploadedImages : data.images ?? [];
    const coverImage = data.coverImage || images[0];

    if (!coverImage) {
      return res.status(400).json({ message: 'At least one project image is required' });
    }

    const slug = data.slug || makeSlug(data.title);
    const project = await prisma.project.create({
      data: {
        ...data,
        slug,
        coverImage,
        images,
        technologies: data.technologies ?? [],
        value: data.value || null,
        duration: data.duration || null,
        featured: data.featured ?? false,
      },
    });
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireAuth, upload.array('images', 10), async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const data = projectSchema.partial().parse(normalizeBody(req.body));
    await ensureCategoryExists(data.category);
    const files = (req.files as any[]) ?? [];
    const uploadedImages = files.length
      ? await Promise.all(files.map((file) => uploadBuffer(file, 'builders-max/projects')))
      : [];
    const existing = await prisma.project.findUniqueOrThrow({ where: { id } });
    const keptImages = data.images ?? existing.images;
    const images = [...keptImages, ...uploadedImages];
    const coverImage = images.includes(data.coverImage ?? '') ? data.coverImage : images[0];

    if (!coverImage) {
      return res.status(400).json({ message: 'At least one project image is required' });
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...data,
        coverImage,
        images,
        slug: data.slug || (data.title ? makeSlug(data.title) : undefined),
        value: data.value === '' ? null : data.value,
        duration: data.duration === '' ? null : data.duration,
      },
    });
    res.json(project);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    await prisma.project.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.post('/:id/images', requireAuth, upload.array('files', 10), async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const files = req.files as any[];
    const urls = await Promise.all(files.map((file) => uploadBuffer(file, 'builders-max/projects')));
    const project = await prisma.project.findUniqueOrThrow({ where: { id } });
    await prisma.project.update({
      where: { id },
      data: { images: [...project.images, ...urls] },
    });
    res.json(urls);
  } catch (error) {
    next(error);
  }
});

export default router;