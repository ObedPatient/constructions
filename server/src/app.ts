import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler, notFound } from './utils/errors.js';
import { trackVisitor } from './middleware/visitor.js';
import authRoutes from './routes/auth.routes.js';
import companyRoutes from './routes/company.routes.js';
import contactRoutes from './routes/contact.routes.js';
import milestoneRoutes from './routes/milestone.routes.js';
import partnerRoutes from './routes/partner.routes.js';
import projectCategoryRoutes from './routes/projectCategory.routes.js';
import projectRoutes from './routes/project.routes.js';
import serviceRoutes from './routes/service.routes.js';
import teamRoutes from './routes/team.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

export const app = express();

app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(trackVisitor);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/milestones', milestoneRoutes);
app.use('/api/v1/partners', partnerRoutes);
app.use('/api/v1/project-categories', projectCategoryRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/team', teamRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

app.use(notFound);
app.use(errorHandler);
