import test from 'node:test';
import assert from 'node:assert';

function getOptimizedImageUrl(url, options = {}) {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=75';
  }

  const cleanUrl = url.trim();
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto'
  } = options;

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

    if (cleanUrl.includes('/upload/f_auto') || cleanUrl.includes('/upload/q_auto')) {
      return cleanUrl;
    }

    return cleanUrl.replace('/upload/', `/upload/${transformationString}/`);
  }

  return cleanUrl;
}

test('Image Optimizer: Injects Cloudinary WebP/AVIF auto format and compression', () => {
  const rawUrl = 'https://res.cloudinary.com/demo/image/upload/v12345/sample_car.jpg';
  const optimized = getOptimizedImageUrl(rawUrl, { width: 640, height: 420 });

  assert.ok(optimized.includes('/upload/f_auto,q_auto,w_640,h_420,c_fill,g_auto/v12345/sample_car.jpg'));
});

test('Image Optimizer: Supports width-only limit transform for large banners', () => {
  const rawUrl = 'https://res.cloudinary.com/demo/image/upload/v12345/banner.png';
  const optimized = getOptimizedImageUrl(rawUrl, { width: 1200, crop: 'limit' });

  assert.ok(optimized.includes('/upload/f_auto,q_auto,w_1200,c_limit/v12345/banner.png'));
});

test('Image Optimizer: Falls back safely on empty or invalid input', () => {
  const empty = getOptimizedImageUrl('');
  const nil = getOptimizedImageUrl(null);

  assert.ok(empty.includes('images.unsplash.com'));
  assert.ok(nil.includes('images.unsplash.com'));
});
