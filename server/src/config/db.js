import mongoose from 'mongoose';

let mongod = null;
let cachedPromise = null;

export const connectDB = async () => {
  // 1. If already connected, return immediately
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // 2. If connection is in progress, reuse the existing promise
  if (cachedPromise) {
    return cachedPromise;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('[MongoDB Error]: MONGODB_URI is not defined in environment variables.');
    throw new Error('MONGODB_URI environment variable is missing.');
  }

  const isAtlas = uri.includes('mongodb+srv://');

  cachedPromise = (async () => {
    try {
      console.log(`[MongoDB]: Connecting to ${isAtlas ? 'MongoDB Atlas' : 'MongoDB'}...`);

      const connection = await mongoose.connect(uri, {
        dbName: 'thilini_rent_a_car',
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 10000
      });

      console.log(`[MongoDB Connected]: ${mongoose.connection.host}/${mongoose.connection.name}`);
      return connection;
    } catch (error) {
      cachedPromise = null; // Reset so next request can retry
      console.error(`[MongoDB Connection Error]:`, error.message);

      // Local development in-memory fallback (only if NOT on Vercel and NOT connecting to Atlas)
      if (process.env.NODE_ENV !== 'production' && !isAtlas && !process.env.VERCEL) {
        try {
          console.log('[MongoDB Embedded]: Starting embedded MongoDB instance...');
          const { MongoMemoryServer } = await import('mongodb-memory-server');
          mongod = await MongoMemoryServer.create();
          const memUri = mongod.getUri();
          const memConn = await mongoose.connect(memUri, { dbName: 'thilini_rent_a_car' });
          console.log(`[MongoDB Connected - In-Memory]: ${memUri}`);

          const { seedDatabase } = await import('../scripts/seed.js');
          await seedDatabase();
          return memConn;
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
