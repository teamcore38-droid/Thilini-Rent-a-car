import test from 'node:test';
import assert from 'node:assert';

// Pure logic overlap verification
function checkIntervalOverlap(startA, endA, startB, endB) {
  const sA = new Date(startA).getTime();
  const eA = new Date(endA).getTime();
  const sB = new Date(startB).getTime();
  const eB = new Date(endB).getTime();

  if (eA <= sA || eB <= sB) {
    throw new Error('Return date must be strictly after pickup date');
  }

  // Two intervals [sA, eA] and [sB, eB] overlap if sA < eB AND eA > sB
  return sA < eB && eA > sB;
}

test('Overlap Detection: Detects exact same date range', () => {
  const overlap = checkIntervalOverlap(
    '2026-09-01T10:00:00Z',
    '2026-09-05T10:00:00Z',
    '2026-09-01T10:00:00Z',
    '2026-09-05T10:00:00Z'
  );
  assert.strictEqual(overlap, true);
});

test('Overlap Detection: Detects partial overlap in middle', () => {
  const overlap = checkIntervalOverlap(
    '2026-09-01T10:00:00Z',
    '2026-09-10T10:00:00Z',
    '2026-09-04T10:00:00Z',
    '2026-09-08T10:00:00Z'
  );
  assert.strictEqual(overlap, true);
});

test('Overlap Detection: Detects overlap when new pickup is before existing return', () => {
  const overlap = checkIntervalOverlap(
    '2026-09-01T10:00:00Z',
    '2026-09-05T10:00:00Z',
    '2026-09-04T10:00:00Z',
    '2026-09-08T10:00:00Z'
  );
  assert.strictEqual(overlap, true);
});

test('Overlap Detection: Returns false for back-to-back non-overlapping bookings', () => {
  const overlap = checkIntervalOverlap(
    '2026-09-01T10:00:00Z',
    '2026-09-05T10:00:00Z',
    '2026-09-05T10:00:00Z',
    '2026-09-10T10:00:00Z'
  );
  assert.strictEqual(overlap, false);
});

test('Overlap Detection: Returns false for completely distinct date ranges', () => {
  const overlap = checkIntervalOverlap(
    '2026-09-01T10:00:00Z',
    '2026-09-05T10:00:00Z',
    '2026-09-12T10:00:00Z',
    '2026-09-15T10:00:00Z'
  );
  assert.strictEqual(overlap, false);
});

test('Overlap Detection: Rejects invalid inverted dates', () => {
  assert.throws(() => {
    checkIntervalOverlap(
      '2026-09-05T10:00:00Z',
      '2026-09-01T10:00:00Z',
      '2026-09-10T10:00:00Z',
      '2026-09-15T10:00:00Z'
    );
  }, /Return date must be strictly after pickup date/);
});
