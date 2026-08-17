import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Checks if Cloudinary credentials are configured
 */
export const isCloudinaryConfigured = () => {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

/**
 * Uploads a file buffer directly to Cloudinary using streaming
 * Applies automatic WebP/AVIF format conversion and quality optimization
 *
 * @param {Buffer} fileBuffer - In-memory file buffer from Multer
 * @param {Object} options - Upload options (folder, custom tags)
 * @returns {Promise<Object>} - Cloudinary upload result
 */
export const uploadBufferToCloudinary = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const { folder = 'thilini_rent_a_car/vehicles', transformation = [] } = options;

    const defaultTransformations = [
      { quality: 'auto', fetch_format: 'auto' },
      { width: 1600, crop: 'limit' }
    ];

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: transformation.length > 0 ? transformation : defaultTransformations
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Deletes an image from Cloudinary by public ID
 *
 * @param {string} publicId - Cloudinary asset public_id
 * @returns {Promise<Object>}
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return null;
  return cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
