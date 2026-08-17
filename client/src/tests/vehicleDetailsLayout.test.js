import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const pageSource = readFileSync(
  new URL('../pages/VehicleDetailsPage.jsx', import.meta.url),
  'utf8',
)

test('mobile details order is summary, technical specifications, then highlights', () => {
  const summary = pageSource.indexOf('data-layout-section="summary"')
  const specifications = pageSource.indexOf('data-layout-section="technical-specifications"')
  const highlights = pageSource.indexOf('layoutSection="mobile-highlights"')

  assert.notEqual(summary, -1)
  assert.notEqual(specifications, -1)
  assert.notEqual(highlights, -1)
  assert.equal(summary < specifications, true)
  assert.equal(specifications < highlights, true)
})

test('highlights use separate mobile and desktop responsive placements', () => {
  assert.match(
    pageSource,
    /className="hidden lg:block mt-6"[\s\S]+layoutSection="desktop-highlights"/,
  )
  assert.match(
    pageSource,
    /className="lg:hidden mb-12"[\s\S]+layoutSection="mobile-highlights"/,
  )
})
