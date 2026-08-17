import {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
  isCloudinaryConfigured
} from '../config/cloudinary.js';

/**
 * Upload single image to Cloudinary
 */
export const uploadSingleImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded. Please select an image (JPEG, PNG, WebP).'
      });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(500).json({
        success: false,
        message:
          'Cloudinary is not configured on the server. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.'
      });
    }

    const folder = req.body.folder || 'thilini_rent_a_car/vehicles';
    const result = await uploadBufferToCloudinary(req.file.buffer, { folder });

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully to Cloudinary',
      image: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes
      }
    });
  } catch (error) {
    console.error('[Cloudinary Upload Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload image to Cloudinary'
    });
  }
};

/**
 * Upload multiple images to Cloudinary concurrently
 */
export const uploadMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files uploaded. Please select at least one image.'
      });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(500).json({
        success: false,
        message:
          'Cloudinary is not configured on the server. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.'
      });
    }

    const folder = req.body.folder || 'thilini_rent_a_car/vehicles';

    const uploadPromises = req.files.map((file) =>
      uploadBufferToCloudinary(file.buffer, { folder })
    );

    const results = await Promise.all(uploadPromises);

    const uploadedImages = results.map((result) => ({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    }));

    res.status(200).json({
      success: true,
      message: `Successfully uploaded ${uploadedImages.length} images to Cloudinary`,
      images: uploadedImages
    });
  } catch (error) {
    console.error('[Cloudinary Multi-Upload Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload images to Cloudinary'
    });
  }
};

/**
 * Delete image from Cloudinary
 */
export const deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Cloudinary publicId is required to delete an image.'
      });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(500).json({
        success: false,
        message: 'Cloudinary is not configured on the server.'
      });
    }

    const result = await deleteFromCloudinary(publicId);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully from Cloudinary',
      result
    });
  } catch (error) {
    console.error('[Cloudinary Delete Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete image from Cloudinary'
    });
  }
};
