import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const projectFile = (relativePath) => readFileSync(
  new URL(`../../../${relativePath}`, import.meta.url),
  'utf8',
)

test('SPA fallback excludes built assets so missing scripts return 404 instead of HTML', () => {
  const config = JSON.parse(projectFile('vercel.json'))
  const indexRewrites = config.rewrites.filter((rewrite) => rewrite.destination === '/index.html')

  assert.equal(indexRewrites.some((rewrite) => rewrite.source === '/(.*)'), false)
  assert.equal(
    indexRewrites.some((rewrite) => rewrite.source.includes('(?!api/|assets/)')),
    true,
  )
})

test('HTML is revalidated while fingerprinted assets remain immutable', () => {
  const config = JSON.parse(projectFile('vercel.json'))
  const assetHeaders = config.headers.find((entry) => entry.source === '/assets/(.*)')
  const routeHeaders = config.headers.filter((entry) => entry.source !== '/assets/(.*)')

  assert.match(assetHeaders.headers[0].value, /max-age=31536000/)
  assert.match(assetHeaders.headers[0].value, /immutable/)
  assert.equal(routeHeaders.length > 0, true)
  routeHeaders.forEach((entry) => {
    assert.match(entry.headers[0].value, /max-age=0/)
    assert.match(entry.headers[0].value, /must-revalidate/)
  })
})

test('static boot fallback prevents a missing entry script from leaving a blank page', () => {
  const html = projectFile('client/index.html')

  assert.match(html, /id="root">[\s\S]+id="trc-boot-fallback"/)
  assert.match(html, />Reload page<\/a>/)
})
