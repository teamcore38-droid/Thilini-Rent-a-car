import { randomUUID } from 'node:crypto';
import mongoose from '../config/mongoose.js';
import { connectDB, getDatabaseState } from '../config/db.js';

const REQUEST_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;
const SLOW_REQUEST_MS = 1000;

const getRequestId = (req) => {
  const incoming = req.get('x-request-id');
  return incoming && REQUEST_ID_PATTERN.test(incoming) ? incoming : randomUUID();
};

const sanitizeRoute = (req) => {
  const pathname = (req.originalUrl || req.url || '/').split('?')[0];
  const segments = pathname.split('/').map((segment, index, allSegments) => {
    if (/^[a-f\d]{24}$/i.test(segment)) return ':id';
    if (/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(segment)) return ':id';
    if (/^\d+$/.test(segment)) return ':number';
    if (allSegments[index - 1] === 'vehicles' && !['admin', 'featured', 'similar'].includes(segment)) {
      return ':slug';
    }
    if (allSegments[index - 1] === 'lookup') return ':reference';
    return segment;
  });
  return segments.join('/') || '/';
};

export const requestContext = (req, res, next) => {
  const startedAt = process.hrtime.bigint();
  req.requestId = getRequestId(req);
  res.set('X-Request-ID', req.requestId);

  res.on('finish', () => {
    if (process.env.NODE_ENV === 'test') return;

    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
    const record = {
      type: 'api_request',
      requestId: req.requestId,
      method: req.method,
      route: sanitizeRoute(req),
      statusCode: res.statusCode,
      durationMs: Number(durationMs.toFixed(1)),
      databaseState: getDatabaseState(mongoose.connection),
      category: res.locals.errorCategory || (durationMs >= SLOW_REQUEST_MS ? 'slow_request' : 'success')
    };

    const writer = res.statusCode >= 500 || durationMs >= SLOW_REQUEST_MS ? console.warn : console.info;
    writer(JSON.stringify(record));
  });

  next();
};

export const createDatabaseAvailabilityMiddleware = (connect = connectDB) =>
  async (req, res, next) => {
    try {
      await connect();
      next();
    } catch {
      res.locals.errorCategory = 'database_unavailable';
      res.set('Cache-Control', 'no-store');
      res.set('Retry-After', '3');
      res.status(503).json({
        success: false,
        code: 'DATABASE_UNAVAILABLE',
        message: 'The service is temporarily unavailable. Please try again shortly.',
        requestId: req.requestId
      });
    }
  };
