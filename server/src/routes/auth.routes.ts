import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { requireAuth, type AuthedRequest } from '../middleware/auth.js';
import { AppError } from '../utils/errors.js';
import { signToken } from '../utils/jwt.js';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function serializeUser(user: { id: string; name: string; email: string; role: 'admin' | 'superadmin' }) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

router.post('/login', async (req, res, next) => {
  try {
    const credentials = loginSchema.parse(req.body);
    const user = await prisma.adminUser.findUnique({ where: { email: credentials.email } });

    if (!user || !(await bcrypt.compare(credentials.password, user.passwordHash))) {
      throw new AppError(401, 'Invalid email or password');
    }

    const token = signToken({ sub: user.id, email: user.email, role: user.role });
    res.json({ user: serializeUser(user), token });
  } catch (error) {
    next(error);
  }
});

router.get('/me', requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const user = await prisma.adminUser.findUniqueOrThrow({ where: { id: req.user!.id } });
    res.json(serializeUser(user));
  } catch (error) {
    next(error);
  }
});

router.post('/logout', requireAuth, (_req, res) => {
  res.status(204).send();
});

export default router;
