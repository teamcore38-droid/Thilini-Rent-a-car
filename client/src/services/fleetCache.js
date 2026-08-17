import api from './api';

export const FLEET_CACHE_TTL_MS = 4 * 60 * 1000;

const fleetCache = new Map();
const inFlightRequests = new Map();
const MAX_CACHE_ENTRIES = 50;

const storeFleetResponse = (key, data) => {
  const now = Date.now();
  for (const [cachedKey, entry] of fleetCache) {
    if (now - entry.cachedAt > FLEET_CACHE_TTL_MS * 3) fleetCache.delete(cachedKey);
  }
  if (!fleetCache.has(key) && fleetCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = fleetCache.keys().next().value;
    fleetCache.delete(oldestKey);
  }
  fleetCache.set(key, { data, cachedAt: now });
};

export const getFleetCacheKey = (params = {}) => {
  const normalized = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => [key, String(value)])
    .sort(([left], [right]) => left.localeCompare(right));
  return new URLSearchParams(normalized).toString();
};

export const getFleetCacheEntry = (params = {}) => {
  const key = getFleetCacheKey(params);
  const entry = fleetCache.get(key);
  if (!entry) return null;
  return {
    ...entry,
    key,
    isFresh: Date.now() - entry.cachedAt < FLEET_CACHE_TTL_MS
  };
};

const canceledError = () => {
  const error = new Error('Request canceled');
  error.name = 'CanceledError';
  error.code = 'ERR_CANCELED';
  return error;
};

const subscribe = (entry, signal) => {
  const subscriber = Symbol('fleet-request');
  entry.subscribers.add(subscriber);

  return new Promise((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      entry.subscribers.delete(subscriber);
      signal?.removeEventListener('abort', abort);
    };

    const abort = () => {
      if (settled) return;
      settled = true;
      cleanup();
      if (entry.subscribers.size === 0) entry.controller.abort();
      reject(canceledError());
    };

    signal?.addEventListener('abort', abort, { once: true });

    entry.promise.then(
      (data) => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve(data);
      },
      (error) => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(error);
      }
    );

    if (signal?.aborted) abort();
  });
};

export const getFleetVehicles = (params = {}, { signal, force = false } = {}) => {
  const key = getFleetCacheKey(params);
  const cached = getFleetCacheEntry(params);
  if (!force && cached?.isFresh) {
    return signal?.aborted ? Promise.reject(canceledError()) : Promise.resolve(cached.data);
  }

  let entry = inFlightRequests.get(key);
  // React Strict Mode can unsubscribe and abort an initial request immediately
  // before remounting the consumer. Never attach the remount to that aborted
  // entry while its promise is still settling.
  if (entry?.controller.signal.aborted) {
    if (inFlightRequests.get(key) === entry) inFlightRequests.delete(key);
    entry = null;
  }
  if (!entry) {
    const controller = new AbortController();
    entry = {
      controller,
      subscribers: new Set(),
      promise: null
    };
    entry.promise = api
      .get('/vehicles', { params, signal: controller.signal })
      .then((response) => {
        storeFleetResponse(key, response.data);
        return response.data;
      })
      .finally(() => {
        if (inFlightRequests.get(key) === entry) inFlightRequests.delete(key);
      });
    inFlightRequests.set(key, entry);
  }

  return subscribe(entry, signal);
};

export const invalidateFleetCache = () => {
  fleetCache.clear();
};

export const clearFleetCacheForTests = () => {
  for (const entry of inFlightRequests.values()) entry.controller.abort();
  inFlightRequests.clear();
  fleetCache.clear();
};
