import api from './api';

export const uploadService = {
  /**
   * Upload a single image to Cloudinary
   * @param {File} file - Image File object from input
   * @param {string} [folder='thilini_rent_a_car/vehicles'] - Cloudinary folder path
   * @returns {Promise<Object>} - Upload result with secure URL and public ID
   */
  uploadSingleImage: async (file, folder = 'thilini_rent_a_car/vehicles') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  /**
   * Upload multiple images to Cloudinary concurrently
   * @param {FileList|File[]} files - Array of image files
   * @param {string} [folder='thilini_rent_a_car/vehicles'] - Cloudinary folder path
   * @returns {Promise<Object>} - Upload result with list of images
   */
  uploadMultipleImages: async (files, folder = 'thilini_rent_a_car/vehicles') => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('images', file);
    });
    formData.append('folder', folder);

    const response = await api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  /**
   * Delete an image from Cloudinary
   * @param {string} publicId - Cloudinary asset public ID
   * @returns {Promise<Object>}
   */
  deleteImage: async (publicId) => {
    const response = await api.delete('/upload/image', {
      data: { publicId }
    });
    return response.data;
  }
};
