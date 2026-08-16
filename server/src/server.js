import 'dotenv/config';
import dns from 'node:dns';

// Ensure public DNS servers are set for MongoDB Atlas SRV resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore if custom DNS is not supported
}

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

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security and utility middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

const allowedOrigins = [
  process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS policy'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global API rate limiting
app.use('/api', apiLimiter);

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Thilini Rent A Car API',
    timezone: 'Asia/Colombo',
    database: {
      connected: mongoose.connection.readyState === 1,
      host: mongoose.connection.host,
      name: mongoose.connection.name
    }
  });
});

// API Routes
app.use('/api/admin/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/settings', settingRoutes);

// Compatibility direct routes
app.use('/api/services', (req, res, next) => {
  req.url = '/services' + (req.url === '/' ? '' : req.url);
  contentRoutes(req, res, next);
});
app.use('/api/faqs', (req, res, next) => {
  req.url = '/faqs' + (req.url === '/' ? '' : req.url);
  contentRoutes(req, res, next);
});
app.use('/api/testimonials', (req, res, next) => {
  req.url = '/testimonials' + (req.url === '/' ? '' : req.url);
  contentRoutes(req, res, next);
});

// 404 Route handler for unknown API endpoints
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route ${req.originalUrl} not found.`
  });
});

// Centralized error handling middleware
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`[Server Ready] Thilini Rent A Car backend listening on port ${PORT}`);
});

export default app;
