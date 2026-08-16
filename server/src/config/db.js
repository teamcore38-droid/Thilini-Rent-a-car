import mongoose from 'mongoose';
import dns from 'node:dns';
import { seedDatabase } from '../scripts/seed.js';

// Configure reliable public DNS servers for resolving MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore if custom DNS not supported by runtime environment
}

let mongod = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/thilini_rent_a_car';
  const isAtlas = uri.includes('mongodb+srv://');

  try {
    console.log(`[MongoDB]: Connecting to ${isAtlas ? 'MongoDB Atlas Cloud' : 'Local MongoDB'}...`);
    
    await mongoose.connect(uri, {
      dbName: 'thilini_rent_a_car',
      serverSelectionTimeoutMS: isAtlas ? 15000 : 4000
    });
    console.log(`[MongoDB Connected]: ${mongoose.connection.host}/${mongoose.connection.name}`);

    // If database is empty on Atlas, seed initial fleet and admin
    const collections = await mongoose.connection.db.listCollections().toArray();
    if (collections.length === 0) {
      console.log('[MongoDB Atlas]: Database is empty. Running initial seed...');
      await seedDatabase();
    }
  } catch (error) {
    console.warn(`[MongoDB Warning]: Primary connection to ${isAtlas ? 'MongoDB Atlas' : uri} failed (${error.message}).`);

    // In development mode, spin up embedded MongoMemoryServer fallback if connection is interrupted
    if (process.env.NODE_ENV !== 'production' && !isAtlas) {
      try {
        console.log('[MongoDB Embedded]: Starting embedded MongoDB instance for frictionless local execution...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongod = await MongoMemoryServer.create();
        const memUri = mongod.getUri();
        await mongoose.connect(memUri, { dbName: 'thilini_rent_a_car' });
        console.log(`[MongoDB Connected - In-Memory]: ${memUri}`);

        // Auto seed the database
        await seedDatabase();
      } catch (memError) {
        console.error('[MongoDB Embedded Error]:', memError.message);
      }
    } else if (isAtlas) {
      console.error('[MongoDB Atlas Error]: Please ensure:');
      console.error(' 1. MongoDB Atlas Network Access (IP Access List) includes 0.0.0.0/0 or your current IP.');
      console.error(' 2. Database User credentials (qzynes_db_user) are active with readWriteAnyDatabase permission.');
    } else {
      process.exit(1);
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
};
