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
import heroSlideRoutes from './routes/heroSlide.routes.js';
import projectCategoryRoutes from './routes/projectCategory.routes.js';
import projectRoutes from './routes/project.routes.js';
import serviceRoutes from './routes/service.routes.js';
import teamRoutes from './routes/team.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

export const app = express();

// ✅ Updated CORS configuration
const allowedOrigins = [
  env.frontendUrl || 'http://localhost:5173',
  'https://buildersmax-frontend.onrender.com',
  'https://buildersmaxconstructions-ltd.onrender.com',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`❌ CORS blocked: ${origin}`);
      callback(new Error(`CORS error: Origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

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
app.use('/api/v1/hero-slides', heroSlideRoutes);
app.use('/api/v1/project-categories', projectCategoryRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/team', teamRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

app.use(notFound);
app.use(errorHandler);