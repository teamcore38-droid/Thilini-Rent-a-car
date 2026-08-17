import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const widgetSource = readFileSync(
  new URL('../components/home/BookingSearchWidget.jsx', import.meta.url),
  'utf8',
)

test('reservation fields stack on phones before switching to wider grids', () => {
  assert.match(widgetSource, /grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5/)
  assert.doesNotMatch(widgetSource, /grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5/)
})

test('both date fields are constrained to their responsive grid cells', () => {
  const dateInputs = [...widgetSource.matchAll(/type="date"[\s\S]*?className="([^"]+)"/g)]

  assert.equal(dateInputs.length, 2)
  dateInputs.forEach(([, className]) => {
    assert.match(className, /\bmin-w-0\b/)
    assert.match(className, /\bmax-w-full\b/)
    assert.match(className, /\bw-full\b/)
  })
})
