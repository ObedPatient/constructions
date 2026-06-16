import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { AppError } from '../utils/errors.js';
import { uploadBuffer } from '../utils/upload.js';

const router = Router();

const socialLinksSchema = z.object({
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  youtube: z.string().optional(),
});

const companySchema = z.object({
  companyName: z.string().min(1).optional(),
  tagline: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  mission: z.string().min(1).optional(),
  vision: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  email: z.string().email().optional(),
  address: z.string().min(1).optional(),
  socialLinks: socialLinksSchema.optional(),
  logo: z.string().optional().nullable(),
  heroImage: z.string().optional().nullable(),
  foundedYear: z.coerce.number().int().optional(),
  projectsCompleted: z.coerce.number().int().optional(),
  clientsSatisfied: z.coerce.number().int().optional(),
  yearsExperience: z.coerce.number().int().optional(),
  awardsWon: z.coerce.number().int().optional(),
});

async function getProfile() {
  const profile = await prisma.companyProfile.findUnique({ where: { id: 'default' } });
  if (!profile) {
    throw new AppError(404, 'Company profile has not been seeded');
  }
  return profile;
}

router.get('/', async (_req, res, next) => {
  try {
    res.json(await getProfile());
  } catch (error) {
    next(error);
  }
});

router.put('/', requireAuth, async (req, res, next) => {
  try {
    const data = companySchema.parse(req.body);
    const current = await getProfile();
    const profile = await prisma.companyProfile.update({
      where: { id: 'default' },
      data: {
        ...data,
        socialLinks: data.socialLinks ? { ...(current.socialLinks as object), ...data.socialLinks } : undefined,
      },
    });
    res.json(profile);
  } catch (error) {
    next(error);
  }
});

router.post('/logo', requireAuth, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) throw new AppError(400, 'Image file is required');
    const url = await uploadBuffer(req.file, 'real-construction/company');
    const profile = await prisma.companyProfile.update({ where: { id: 'default' }, data: { logo: url } });
    res.json({ url: profile.logo });
  } catch (error) {
    next(error);
  }
});

router.post('/hero-image', requireAuth, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) throw new AppError(400, 'Image file is required');
    const url = await uploadBuffer(req.file, 'real-construction/company');
    const profile = await prisma.companyProfile.update({ where: { id: 'default' }, data: { heroImage: url } });
    res.json({ url: profile.heroImage });
  } catch (error) {
    next(error);
  }
});

export default router;
