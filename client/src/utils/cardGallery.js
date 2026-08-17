export const normalizeVehicleImages = (images) => {
  if (!Array.isArray(images)) return [];

  const normalized = [];
  const byUrl = new Map();

  for (const image of images) {
    const item =
      typeof image === 'string'
        ? { url: image.trim(), alt: '', isPrimary: false }
        : {
            url: typeof image?.url === 'string' ? image.url.trim() : '',
            alt: typeof image?.alt === 'string' ? image.alt : '',
            isPrimary: image?.isPrimary === true
          };

    if (!item.url) continue;

    const existing = byUrl.get(item.url);
    if (existing) {
      existing.isPrimary ||= item.isPrimary;
      existing.alt ||= item.alt;
      continue;
    }

    normalized.push(item);
    byUrl.set(item.url, item);
  }

  const primaryIndex = normalized.findIndex((image) => image.isPrimary);
  if (primaryIndex <= 0) return normalized;

  return [
    normalized[primaryIndex],
    ...normalized.slice(0, primaryIndex),
    ...normalized.slice(primaryIndex + 1)
  ];
};

export const getAdjacentImageIndex = (currentIndex, imageCount, direction) => {
  if (!Number.isInteger(imageCount) || imageCount <= 0) return 0;

  const safeIndex = ((currentIndex % imageCount) + imageCount) % imageCount;
  if (direction === 0) return safeIndex;

  const step = direction < 0 ? -1 : 1;
  return (safeIndex + step + imageCount) % imageCount;
};

export const getSwipeDirection = (startX, endX, threshold = 40) => {
  if (!Number.isFinite(startX) || !Number.isFinite(endX)) return 0;

  const distance = startX - endX;
  if (distance >= threshold) return 1;
  if (distance <= -threshold) return -1;
  return 0;
};
