const CHUNK_ERROR_PATTERNS = [
  /failed to fetch dynamically imported module/i,
  /importing a module script failed/i,
  /loading (?:css )?chunk .+ failed/i,
  /chunkloaderror/i,
]

const RELOAD_KEY_PREFIX = 'trc:chunk-reload:'

const errorMessage = (error) => {
  if (typeof error === 'string') return error
  return error?.message || String(error || '')
}

const hash = (value) => {
  let result = 0
  for (let index = 0; index < value.length; index += 1) {
    result = ((result << 5) - result + value.charCodeAt(index)) | 0
  }
  return Math.abs(result).toString(36)
}

export const isChunkLoadError = (error) => {
  if (error?.name === 'ChunkLoadError') return true
  return CHUNK_ERROR_PATTERNS.some((pattern) => pattern.test(errorMessage(error)))
}

export const getChunkReloadKey = (_error, pathname = '/') =>
  `${RELOAD_KEY_PREFIX}${hash(pathname)}`

export const shouldAttemptChunkReload = (error, storage, pathname = '/') => {
  if (!isChunkLoadError(error) || !storage) return false

  try {
    const key = getChunkReloadKey(error, pathname)
    if (storage.getItem(key)) return false
    storage.setItem(key, '1')
    return true
  } catch {
    return false
  }
}

export const clearChunkReloadAttempt = (error, storage, pathname = '/') => {
  if (!isChunkLoadError(error) || !storage) return

  clearChunkReloadGuard(storage, pathname)
}

export const clearChunkReloadGuard = (storage, pathname = '/') => {
  if (!storage) return

  try {
    storage.removeItem(getChunkReloadKey(null, pathname))
  } catch {
    // Storage may be unavailable in private browsing or restricted environments.
  }
}
