import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth.js';
import {
  uploadSingleImage,
  uploadMultipleImages,
  deleteImage
} from '../controllers/uploadController.js';
import { noStore } from '../middleware/cache.js';

const router = express.Router();
router.use(noStore);

// Memory storage for stream uploads directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/svg+xml'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported file format: ${file.mimetype}. Allowed types: JPEG, PNG, WebP, AVIF, SVG.`
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB per image
  },
  fileFilter
});

// Single image upload (Protected)
router.post('/image', protect, upload.single('image'), uploadSingleImage);

// Multi-image upload (Protected, max 10 images)
router.post('/multiple', protect, upload.array('images', 10), uploadMultipleImages);

// Delete image (Protected)
router.delete('/image', protect, deleteImage);

export default router;
