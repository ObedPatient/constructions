import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadBuffer } from '../utils/upload.js';

const router = Router();

const serviceSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  icon: z.string().min(1),
  features: z.array(z.string()).optional(),
  image: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().optional(),
});

function normalizeBody(body: Record<string, unknown>) {
  return {
    ...body,
    features: typeof body.features === 'string' ? JSON.parse(body.features) : body.features,
  };
}

router.get('/', async (_req, res, next) => {
  try {
    const services = await prisma.service.findMany({ orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }] });
    res.json(services);
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    const data = serviceSchema.parse(normalizeBody(req.body));
    const file = req.file as any;
    const uploadedImage = file ? await uploadBuffer(file, 'builders-max/services') : undefined;
    const service = await prisma.service.create({
      data: {
        ...data,
        features: data.features ?? [],
        image: uploadedImage || data.image || null,
        sortOrder: data.sortOrder ?? 0,
      },
    });
    res.status(201).json(service);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const data = serviceSchema.partial().parse(normalizeBody(req.body));
    const file = req.file as any;
    const uploadedImage = file ? await uploadBuffer(file, 'builders-max/services') : undefined;
    const service = await prisma.service.update({
      where: { id },
      data: {
        ...data,
        image: uploadedImage || (data.image === '' ? null : data.image),
      },
    });
    res.json(service);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    await prisma.service.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;