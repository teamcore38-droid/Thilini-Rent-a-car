import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
  isCloudinaryConfigured
} from '../config/cloudinary.js';

console.log('--- Checking Cloudinary Environment Configuration ---');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✓ Set (' + process.env.CLOUDINARY_CLOUD_NAME + ')' : '✗ Missing');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✓ Set (' + process.env.CLOUDINARY_API_KEY.slice(0, 4) + '...)' : '✗ Missing');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✓ Set (*** hidden ***)' : '✗ Missing');

if (!isCloudinaryConfigured()) {
  console.error('\n❌ Cloudinary configuration is incomplete. Please check your .env file.');
  process.exit(1);
}

async function runTest() {
  try {
    console.log('\n--- 1. Testing Cloudinary API Ping ---');
    const pingResult = await cloudinary.api.ping();
    console.log('Ping Result:', pingResult);

    console.log('\n--- 2. Testing Buffer Upload (Auto WebP / Compression) ---');
    // Minimal 1x1 PNG transparent pixel buffer
    const testPngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );

    const uploadResult = await uploadBufferToCloudinary(testPngBuffer, {
      folder: 'thilini_rent_a_car/test_uploads'
    });

    console.log('Upload Successful!');
    console.log('  • Secure URL:', uploadResult.secure_url);
    console.log('  • Public ID:', uploadResult.public_id);
    console.log('  • Format:', uploadResult.format);
    console.log('  • Dimensions:', `${uploadResult.width}x${uploadResult.height}`);
    console.log('  • Size:', `${uploadResult.bytes} bytes`);

    console.log('\n--- 3. Cleaning up Test Asset ---');
    const deleteResult = await deleteFromCloudinary(uploadResult.public_id);
    console.log('Cleanup Result:', deleteResult);

    console.log('\n✅ Cloudinary Integration is WORKING PERFECTLY and ready for production!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Cloudinary Test Failed with error:', error.message || error);
    process.exit(1);
  }
}

runTest();
