import test from 'node:test';
import assert from 'node:assert';

function generateWhatsAppUrl(phone, vehicleName, refNumber, pickupDate, returnDate) {
  const cleanNumber = (phone || '').replace(/[^0-9]/g, '');
  const message = `Hello Thilini Rent A Car! Booking *${refNumber}* for *${vehicleName}* (${pickupDate} to ${returnDate}).`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

test('WhatsApp URL: Cleans Sri Lankan phone and properly URI encodes message', () => {
  const url = generateWhatsAppUrl(
    '+94 77 123 4567',
    'Toyota Aqua Hybrid',
    'TRC-2026-0001',
    '2026-09-01',
    '2026-09-05'
  );

  assert.ok(url.startsWith('https://wa.me/94771234567?text='));
  assert.ok(url.includes('TRC-2026-0001'));
  assert.ok(url.includes('Toyota%20Aqua%20Hybrid'));
});

test('Phone Number Sanitizer: Correctly cleans +94 format', () => {
  const raw = '+94 (77) 123-4567';
  const clean = raw.replace(/[^0-9]/g, '');
  assert.strictEqual(clean, '94771234567');
});
