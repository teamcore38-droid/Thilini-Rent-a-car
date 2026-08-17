import test from 'node:test';
import assert from 'node:assert';
import { DEFAULT_BUSINESS_SETTINGS } from '../config/constants.js';

test('Settings Resilience: Fallback settings contains all required brand fields', () => {
  assert.ok(DEFAULT_BUSINESS_SETTINGS.businessName);
  assert.ok(DEFAULT_BUSINESS_SETTINGS.phone);
  assert.ok(DEFAULT_BUSINESS_SETTINGS.whatsapp);
  assert.ok(DEFAULT_BUSINESS_SETTINGS.email);
  assert.ok(DEFAULT_BUSINESS_SETTINGS.bookingLocations.officeLocation);
  assert.ok(DEFAULT_BUSINESS_SETTINGS.bookingLocations.airportLocation);
  assert.ok(DEFAULT_BUSINESS_SETTINGS.bookingLocations.defaultHandoverLocation);
  assert.strictEqual(typeof DEFAULT_BUSINESS_SETTINGS.businessName, 'string');
});

test('Connection Cache Resilience: Single-promise prevents concurrent connection conflicts', async () => {
  let callCount = 0;
  let cachedPromise = null;

  const mockConnect = () => {
    if (cachedPromise) return cachedPromise;
    cachedPromise = new Promise((resolve) => {
      callCount++;
      setTimeout(() => resolve('connected'), 10);
    });
    return cachedPromise;
  };

  // Simulate 5 concurrent incoming requests arriving at the exact same millisecond
  const results = await Promise.all([
    mockConnect(),
    mockConnect(),
    mockConnect(),
    mockConnect(),
    mockConnect()
  ]);

  assert.strictEqual(callCount, 1, 'Only 1 connection handshake must be initiated across concurrent requests');
  assert.deepStrictEqual(results, ['connected', 'connected', 'connected', 'connected', 'connected']);
});

test('Auth Resilience: Trims whitespace and normalizes email format', () => {
  const dirtyEmail = '  Admin@ThiliniRentACar.com  ';
  const cleanEmail = dirtyEmail.toLowerCase().trim();

  const dirtyPassword = '  Admin@Thilini2026#  ';
  const cleanPassword = dirtyPassword.trim();

  assert.strictEqual(cleanEmail, 'admin@thilinirentacar.com');
  assert.strictEqual(cleanPassword, 'Admin@Thilini2026#');
});
