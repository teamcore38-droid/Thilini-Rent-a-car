import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Resilient DB connection middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.warn(`[Database Middleware Notice]: Proceeding for ${req.method} ${req.path}, DB readyState: ${mongoose.connection.readyState}`);
  }
  next();
});

// Security and utility middleware
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
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global API rate limiting (skip during tests and in serverless)
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.use('/api', apiLimiter);
}

// Health Check Endpoint (supports both /api/health and /health)
const healthHandler = (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Thilini Rent A Car API',
    timezone: 'Asia/Colombo',
    database: {
      connected: mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host || 'unknown',
      name: mongoose.connection.name || 'unknown'
    }
  });
};
app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

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
