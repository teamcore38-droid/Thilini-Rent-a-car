const setPublicCache = (res, browserSeconds, edgeSeconds, staleSeconds) => {
  res.vary('Accept-Encoding');
  res.set(
    'Cache-Control',
    `public, max-age=${browserSeconds}, s-maxage=${edgeSeconds}, stale-while-revalidate=${staleSeconds}`
  );
};

// Public fleet/content changes infrequently, so short caching removes repeated
// database/serverless work while keeping administrative updates visible quickly.
export const cachePublicData = (req, res, next) => {
  setPublicCache(res, 0, 60, 300);
  next();
};

export const cacheVehicleDetails = (req, res, next) => {
  setPublicCache(res, 0, 300, 600);
  next();
};

export const cachePublicSettings = (req, res, next) => {
  setPublicCache(res, 0, 60, 300);
  next();
};

export const noStore = (req, res, next) => {
  res.set('Cache-Control', 'private, no-store');
  next();
};
