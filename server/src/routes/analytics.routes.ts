import { Router } from 'express';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/errors.js';

const router = Router();

router.get('/visitors/monthly', async (_req, res, next) => {
  try {
    // Get visitors for the past 12 months
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);

    const visitors = await prisma.visitor.findMany({
      where: {
        timestamp: {
          gte: twelveMonthsAgo,
        },
      },
      select: {
        timestamp: true,
      },
    });

    // Group by month and year
    const monthlyData: Record<string, number> = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    visitors.forEach((visitor) => {
      const date = visitor.timestamp;
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });

    // Generate last 12 months in order
    const result = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      const shortMonth = monthNames[date.getMonth()];
      result.push({
        month: shortMonth,
        visitors: monthlyData[monthKey] || 0,
      });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/visitors/total', async (_req, res, next) => {
  try {
    const total = await prisma.visitor.count();
    const lastMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const lastMonthTotal = await prisma.visitor.count({
      where: {
        timestamp: {
          gte: lastMonthAgo,
        },
      },
    });

    res.json({
      total,
      lastMonth: lastMonthTotal,
      growth: total > 0 ? Math.round(((lastMonthTotal - (total - lastMonthTotal)) / (total - lastMonthTotal)) * 100) : 0,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
