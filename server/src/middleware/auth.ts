import { NextFunction, Request, Response } from 'express';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/errors.js';
import { verifyToken } from '../utils/jwt.js';

export interface AuthedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export async function requireAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  try {
    // ✅ FIX: Use type assertion to access headers
    const header = (req as Request).headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      throw new AppError(401, 'Authentication required');
    }

    const payload = verifyToken(token);
    const user = await prisma.adminUser.findUnique({ where: { id: payload.sub } });

    if (!user) {
      throw new AppError(401, 'Invalid token');
    }

    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (error) {
    next(error instanceof AppError ? error : new AppError(401, 'Invalid token'));
  }
}