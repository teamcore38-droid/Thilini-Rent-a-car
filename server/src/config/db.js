import mongoose from 'mongoose';
import dns from 'node:dns';
import { seedDatabase } from '../scripts/seed.js';

// Configure public DNS servers only for local development (never in Vercel/Lambda cloud)
if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
  } catch (e) {
    // Ignore if custom DNS is not supported in the runtime environment
  }
}

let mongod = null;
let cachedPromise = null;

export const connectDB = async () => {
  // 1. If already connected, return immediately
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // 2. If a connection attempt is already in progress, reuse the same promise
  if (cachedPromise) {
    return cachedPromise;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/thilini_rent_a_car';
  const isAtlas = uri.includes('mongodb+srv://');

  cachedPromise = (async () => {
    try {
      console.log(`[MongoDB]: Connecting to ${isAtlas ? 'MongoDB Atlas Cloud' : 'Local MongoDB'}...`);
      
      await mongoose.connect(uri, {
        dbName: 'thilini_rent_a_car',
        serverSelectionTimeoutMS: isAtlas ? 10000 : 4000
      });
      console.log(`[MongoDB Connected]: ${mongoose.connection.host}/${mongoose.connection.name}`);
      return mongoose.connection;
    } catch (error) {
      cachedPromise = null; // Reset so next request can retry
      console.warn(`[MongoDB Warning]: Primary connection failed (${error.message}).`);

      // In local development mode (not on Vercel), spin up embedded MongoMemoryServer fallback
      if (process.env.NODE_ENV !== 'production' && !isAtlas && !process.env.VERCEL) {
        try {
          console.log('[MongoDB Embedded]: Starting embedded MongoDB instance for local execution...');
          const { MongoMemoryServer } = await import('mongodb-memory-server');
          mongod = await MongoMemoryServer.create();
          const memUri = mongod.getUri();
          await mongoose.connect(memUri, { dbName: 'thilini_rent_a_car' });
          console.log(`[MongoDB Connected - In-Memory]: ${memUri}`);

          await seedDatabase();
          return mongoose.connection;
        } catch (memError) {
          console.error('[MongoDB Embedded Error]:', memError.message);
        }
      }
      throw error;
    }
  })();

  return cachedPromise;
};

export const closeDB = async () => {
  cachedPromise = null;
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
};
