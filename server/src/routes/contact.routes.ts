import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { sendContactEmail } from '../utils/mailer.js';

const router = Router();

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(3),
  subject: z.string().min(2),
  message: z.string().min(10),
});

router.post('/', async (req, res, next) => {
  try {
    const data = contactSchema.parse(req.body);
    const message = await prisma.contactMessage.create({ data });
    await sendContactEmail(data);
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
});

router.get('/messages', requireAuth, async (_req, res, next) => {
  try {
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(messages);
  } catch (error) {
    next(error);
  }
});

router.patch('/messages/:id/read', requireAuth, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const message = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
    res.json(message);
  } catch (error) {
    next(error);
  }
});

router.delete('/messages/:id', requireAuth, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    await prisma.contactMessage.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
