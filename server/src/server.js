import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from './config/mongoose.js';
import { connectDB, getDatabaseState } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import {
  createDatabaseAvailabilityMiddleware,
  requestContext
} from './middleware/requestContext.js';

// Public read routes stay warm; heavier booking/auth/upload code loads only when used.
import vehicleRoutes from './routes/vehicleRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import settingRoutes from './routes/settingRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
let databaseConnector = connectDB;

export const setDatabaseConnectorForTests = (connector) => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Database connector overrides are only available in tests.');
  }
  databaseConnector = connector || connectDB;
};

const lazyRouter = (loader) => {
  let routerPromise;

  return async (req, res, next) => {
    try {
      routerPromise ||= loader().then((module) => module.default);
      const router = await routerPromise;
      return router(req, res, next);
    } catch (error) {
      routerPromise = null;
      return next(error);
    }
  };
};

const authRoutes = lazyRouter(() => import('./routes/authRoutes.js'));
const bookingRoutes = lazyRouter(() => import('./routes/bookingRoutes.js'));
const uploadRoutes = lazyRouter(() => import('./routes/uploadRoutes.js'));

app.use(requestContext);

// Security and utility middleware. These stay ahead of health and API routes,
// while database connection work is limited to database-dependent routes.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    exposedHeaders: ['X-Request-ID', 'Retry-After']
  })
);

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const livenessHandler = (req, res) => {
  res.status(200).json({
    success: true,
    status: 'live',
    requestId: req.requestId
  });
};

const readinessHandler = (req, res) => {
  const database = getDatabaseState(mongoose.connection);
  const ready = database === 'connected';
  if (!ready) {
    res.locals.errorCategory = 'not_ready';
    res.set('Cache-Control', 'no-store');
  }
  res.status(ready ? 200 : 503).json({
    success: ready,
    status: ready ? 'ready' : 'not_ready',
    database,
    requestId: req.requestId
  });
};

// Health routes never initiate or await a database connection.
app.get('/health/live', livenessHandler);
app.get('/api/health/live', livenessHandler);
app.get('/health/ready', readinessHandler);
app.get('/api/health/ready', readinessHandler);
app.get('/health', livenessHandler);
app.get('/api/health', livenessHandler);

// Global API rate limiting (skip during tests and in serverless)
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.use('/api', apiLimiter);
}

// Database-dependent requests stop here with a safe 503 if MongoDB is unavailable.
app.use(createDatabaseAvailabilityMiddleware(() => databaseConnector()));

// Mount routes with '/api' prefix (Standard)
app.use('/api/admin/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/upload', uploadRoutes);

// Mount routes directly (Vercel Serverless Function compatibility)
app.use('/admin/auth', authRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/bookings', bookingRoutes);
app.use('/content', contentRoutes);
app.use('/settings', settingRoutes);
app.use('/upload', uploadRoutes);

// Compatibility direct content shortcuts
app.use('/api/services', (req, res, next) => {
  req.url = '/services' + (req.url === '/' ? '' : req.url);
  contentRoutes(req, res, next);
});
app.use('/services', (req, res, next) => {
  req.url = '/services' + (req.url === '/' ? '' : req.url);
  contentRoutes(req, res, next);
});

app.use('/api/faqs', (req, res, next) => {
  req.url = '/faqs' + (req.url === '/' ? '' : req.url);
  contentRoutes(req, res, next);
});
app.use('/faqs', (req, res, next) => {
  req.url = '/faqs' + (req.url === '/' ? '' : req.url);
  contentRoutes(req, res, next);
});

app.use('/api/testimonials', (req, res, next) => {
  req.url = '/testimonials' + (req.url === '/' ? '' : req.url);
  contentRoutes(req, res, next);
});
app.use('/testimonials', (req, res, next) => {
  req.url = '/testimonials' + (req.url === '/' ? '' : req.url);
  contentRoutes(req, res, next);
});

// Centralized error handling middleware
app.use(errorHandler);

// Only listen when running standalone directly (not on Vercel)
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Server Ready] Thilini Rent A Car backend listening on port ${PORT}`);
  });
}

export default app;
