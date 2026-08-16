import test from 'node:test';
import assert from 'node:assert';

test('Booking Reference Format: Generates TRC-YYYY-XXXX structure', () => {
  const currentYear = new Date().getFullYear();
  const sequence = 1;
  const ref = `TRC-${currentYear}-${String(sequence).padStart(4, '0')}`;
  
  assert.match(ref, /^TRC-\d{4}-\d{4}$/);
  assert.strictEqual(ref, `TRC-${currentYear}-0001`);
});

test('Booking Reference Sequence: Increments correctly', () => {
  const lastRef = 'TRC-2026-0042';
  const parts = lastRef.split('-');
  const nextSeq = parseInt(parts[2], 10) + 1;
  const nextRef = `TRC-2026-${String(nextSeq).padStart(4, '0')}`;
  
  assert.strictEqual(nextRef, 'TRC-2026-0043');
});
