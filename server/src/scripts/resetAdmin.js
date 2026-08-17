import mongoose from '../config/mongoose.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import dns from 'node:dns';
import { Admin } from '../models/Admin.js';

dotenv.config();

try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}

const resetAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log('[Connecting to MongoDB]:', mongoUri);
    await mongoose.connect(mongoUri, {
      dbName: 'thilini_rent_a_car',
      serverSelectionTimeoutMS: 15000
    });
    console.log('[Connected successfully to]:', mongoose.connection.name);

    const email = (process.env.ADMIN_EMAIL || 'admin@thilinirentacar.com').toLowerCase().trim();
    const password = (process.env.ADMIN_PASSWORD || 'Admin@Thilini2026#').trim();

    console.log('[Target Admin Email]:', email);
    console.log('[Target Admin Password Length]:', password.length);

    // Delete any existing admin record with this email or all admins
    await Admin.deleteMany({});

    // Hash password with bcryptjs
    const passwordHash = await bcrypt.hash(password, 12);

    const newAdmin = await Admin.create({
      name: 'Thilini Admin',
      email,
      passwordHash,
      role: 'superadmin'
    });

    console.log('[Admin Created Successfully]:', newAdmin.email, 'ID:', newAdmin._id);

    // Test comparePassword
    const testMatch = await newAdmin.comparePassword(password);
    console.log('[Verification comparePassword Test Match]:', testMatch);

    const found = await Admin.findOne({ email });
    console.log('[Query from DB findOne]:', found ? found.email : 'NOT FOUND');
    if (found) {
      const matchFound = await found.comparePassword(password);
      console.log('[DB Record Password Match]:', matchFound);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Error in resetAdmin]:', error);
    process.exit(1);
  }
};

resetAdmin();
