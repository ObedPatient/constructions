import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadBuffer } from '../utils/upload.js';
import { AppError } from '../utils/errors.js';

const router = Router();

const partnerSchema = z.object({
  name: z.string().min(2),
  logo: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().optional(),
});

function ensurePartnerModel() {
  if (!prisma.partner) {
    throw new AppError(503, 'Partner model is not ready. Restart the API server, then run the latest Prisma migration if needed.');
  }
}

router.get('/', async (_req, res, next) => {
  try {
    ensurePartnerModel();
    const partners = await prisma.partner.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] });
    res.json(partners);
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, upload.single('logo'), async (req, res, next) => {
  try {
    ensurePartnerModel();
    const data = partnerSchema.parse(req.body);
    const file = req.file as Express.Multer.File | undefined;
    const uploadedLogo = file ? await uploadBuffer(file, 'real-construction/partners') : undefined;
    const partner = await prisma.partner.create({
      data: {
        ...data,
        logo: uploadedLogo || data.logo || null,
        website: data.website || null,
        sortOrder: data.sortOrder ?? 0,

      },
    });
    res.status(201).json(partner);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireAuth, upload.single('logo'), async (req, res, next) => {
  try {
    ensurePartnerModel();
    const id = String(req.params.id);
    const data = partnerSchema.partial().parse(req.body);
    const file = req.file as Express.Multer.File | undefined;
    const uploadedLogo = file ? await uploadBuffer(file, 'real-construction/partners') : undefined;
    const partner = await prisma.partner.update({
      where: { id },
      data: {
        ...data,
        logo: uploadedLogo || (data.logo === '' ? null : data.logo),
        website: data.website === '' ? null : data.website,
      },
    });
    res.json(partner);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    ensurePartnerModel();
    const id = String(req.params.id);
    await prisma.partner.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;