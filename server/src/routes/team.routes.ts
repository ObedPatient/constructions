import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { AppError } from '../utils/errors.js';
import { uploadBuffer } from '../utils/upload.js';

const router = Router();

const teamMemberSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  bio: z.string().min(10),
  image: z.string().min(1),
  linkedin: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().optional(),
});

router.get('/', async (_req, res, next) => {
  try {
    const team = await prisma.teamMember.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] });
    res.json(team);
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    const file = req.file as any;
    const uploadedImage = file ? await uploadBuffer(file, 'builders-max/team') : undefined;
    const data = teamMemberSchema.parse({
      ...req.body,
      image: uploadedImage || req.body.image,
    });

    if (!data.image) {
      throw new AppError(400, 'Image file is required');
    }

    const member = await prisma.teamMember.create({
      data: {
        ...data,
        linkedin: data.linkedin || null,
        sortOrder: data.sortOrder ?? 0,
      },
    });
    res.status(201).json(member);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const file = req.file as any;
    const uploadedImage = file ? await uploadBuffer(file, 'builders-max/team') : undefined;
    const data = teamMemberSchema.partial().parse({
      ...req.body,
      image: uploadedImage || req.body.image,
    });
    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        ...data,
        linkedin: data.linkedin === '' ? null : data.linkedin,
      },
    });
    res.json(member);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    await prisma.teamMember.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;