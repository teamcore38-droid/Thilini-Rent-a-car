/**
 * Cloudinary & CDN Image Optimization Utility
 *
 * Automatically converts image delivery to next-gen formats (WebP/AVIF),
 * applies intelligent compression, and dynamic responsive resizing to ensure
 * lightweight and lightning-fast page loading for users on mobile connections.
 */

const FALLBACK_CAR_IMAGE =
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=75';

/**
 * Returns an optimized image URL tailored for device screen size and connection speed.
 *
 * @param {string} url - Original image URL (Cloudinary, Unsplash, or local)
 * @param {Object} options - Transformation options
 * @param {number} [options.width] - Target width in pixels
 * @param {number} [options.height] - Target height in pixels
 * @param {string} [options.crop='fill'] - Crop mode: 'fill' | 'limit' | 'fit' | 'thumb'
 * @param {string} [options.quality='auto'] - Cloudinary auto quality: 'auto' | 'auto:good' | 'auto:eco'
 * @param {string} [options.format='auto'] - Cloudinary auto format (WebP / AVIF)
 * @returns {string} Optimized URL
 */
export const getOptimizedImageUrl = (url, options = {}) => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return FALLBACK_CAR_IMAGE;
  }

  const cleanUrl = url.trim();
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto'
  } = options;

  // 1. Cloudinary Delivery URL Transformation
  if (cleanUrl.includes('res.cloudinary.com') && cleanUrl.includes('/upload/')) {
    const transformParts = [`f_${format}`, `q_${quality}`];

    if (width) transformParts.push(`w_${width}`);
    if (height) transformParts.push(`h_${height}`);
    if (width && height && crop) {
      transformParts.push(`c_${crop},g_auto`);
    } else if (width && crop === 'limit') {
      transformParts.push('c_limit');
    }

    const transformationString = transformParts.join(',');

    // Avoid injecting the exact same transformation more than once.
    if (cleanUrl.includes(`/upload/${transformationString}/`)) {
      return cleanUrl;
    }

    return cleanUrl.replace('/upload/', `/upload/${transformationString}/`);
  }

  // 2. Unsplash CDN Responsive Optimization
  if (cleanUrl.includes('images.unsplash.com')) {
    try {
      const parsedUrl = new URL(cleanUrl);
      parsedUrl.searchParams.set('auto', 'format');
      parsedUrl.searchParams.set('q', quality === 'auto:eco' ? '60' : '75');
      if (width) parsedUrl.searchParams.set('w', String(width));
      if (height) parsedUrl.searchParams.set('h', String(height));
      if (crop) parsedUrl.searchParams.set('fit', crop === 'fill' ? 'crop' : 'max');
      return parsedUrl.toString();
    } catch {
      return cleanUrl;
    }
  }

  return cleanUrl;
};

export const getResponsiveImageSrcSet = (url, preset, widths = []) => {
  if (!url || widths.length === 0) return undefined;
  const ratio = preset.width && preset.height ? preset.height / preset.width : null;
  const candidates = widths.map((width) => {
    const height = ratio ? Math.round(width * ratio) : undefined;
    return `${getOptimizedImageUrl(url, { ...preset, width, height })} ${width}w`;
  });
  return [...new Set(candidates)].join(', ');
};

/**
 * Common optimized presets for different UI components
 */
export const ImagePresets = {
  // Vehicle grid cards (mobile friendly, fast 3:2 ratio ~40KB)
  fleetCard: { width: 640, height: 420, crop: 'fill', quality: 'auto', format: 'auto' },

  // Vehicle detail main photo viewer
  heroGallery: { width: 1200, height: 800, crop: 'fill', quality: 'auto', format: 'auto' },

  // Thumbnail preview strip
  thumbnail: { width: 160, height: 110, crop: 'fill', quality: 'auto:eco', format: 'auto' },

  // Small avatar or icon preview
  avatar: { width: 96, height: 96, crop: 'fill', quality: 'auto', format: 'auto' }
};
