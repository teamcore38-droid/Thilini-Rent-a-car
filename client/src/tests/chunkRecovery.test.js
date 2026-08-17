import assert from 'node:assert/strict'
import test from 'node:test'
import {
  clearChunkReloadAttempt,
  getChunkReloadKey,
  isChunkLoadError,
  shouldAttemptChunkReload,
} from '../utils/chunkRecovery.js'

const memoryStorage = () => {
  const values = new Map()
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  }
}

test('recognizes Vite dynamic import and browser chunk failures', () => {
  assert.equal(isChunkLoadError(
    new TypeError('Failed to fetch dynamically imported module: https://example.com/assets/HomePage-old.js'),
  ), true)
  assert.equal(isChunkLoadError(new Error('Importing a module script failed.')), true)
  assert.equal(isChunkLoadError(new Error('Loading chunk 42 failed.')), true)
  assert.equal(isChunkLoadError({ name: 'ChunkLoadError', message: 'network error' }), true)
})

test('does not classify an ordinary render exception as a chunk failure', () => {
  assert.equal(isChunkLoadError(new Error('Cannot read properties of undefined')), false)
})

test('reloads once for the same failed chunk and path', () => {
  const storage = memoryStorage()
  const error = new TypeError(
    'Failed to fetch dynamically imported module: https://example.com/assets/HomePage-old.js',
  )

  assert.equal(shouldAttemptChunkReload(error, storage, '/fleet'), true)
  assert.equal(shouldAttemptChunkReload(error, storage, '/fleet'), false)
  assert.equal(storage.getItem(getChunkReloadKey(error, '/fleet')), '1')
})

test('parallel chunk failures on one page cannot trigger a reload cascade', () => {
  const storage = memoryStorage()
  const homeError = new Error('Loading chunk /assets/HomePage-old.js failed.')
  const iconError = new Error('Loading chunk /assets/star-old.js failed.')

  assert.equal(shouldAttemptChunkReload(homeError, storage, '/'), true)
  assert.equal(shouldAttemptChunkReload(iconError, storage, '/'), false)
  assert.equal(shouldAttemptChunkReload(iconError, storage, '/fleet'), true)
})

test('manual recovery clears the loop guard so a reload can be retried', () => {
  const storage = memoryStorage()
  const error = new Error('Loading chunk /assets/HomePage-old.js failed.')

  assert.equal(shouldAttemptChunkReload(error, storage, '/'), true)
  clearChunkReloadAttempt(error, storage, '/')
  assert.equal(shouldAttemptChunkReload(error, storage, '/'), true)
})

test('fails safely when session storage is unavailable', () => {
  const restrictedStorage = {
    getItem: () => { throw new Error('SecurityError') },
    setItem: () => { throw new Error('SecurityError') },
  }

  assert.equal(
    shouldAttemptChunkReload(new Error('Loading chunk 1 failed.'), restrictedStorage, '/'),
    false,
  )
})
