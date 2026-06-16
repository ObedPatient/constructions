import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';

export async function trackVisitor(req: Request, res: Response, next: NextFunction) {
  try {
    // Only track public routes, skip API calls and static files
    if (!req.path.startsWith('/api') && !req.path.includes('.')) {
      await prisma.visitor.create({
        data: {
          path: req.path,
          userAgent: req.get('user-agent') || undefined,
          referer: req.get('referer') || undefined,
        },
      });
    }
  } catch (error) {
    // Silently fail - don't break the request if tracking fails
    console.error('Visitor tracking error:', error);
  }
  next();
}
