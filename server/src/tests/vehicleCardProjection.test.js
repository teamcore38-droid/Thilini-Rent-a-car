import assert from 'node:assert/strict';
import test from 'node:test';
import { VEHICLE_CARD_PROJECTION } from '../controllers/vehicleController.js';

test('vehicle card payload includes all selectable rental rates', () => {
  assert.equal(VEHICLE_CARD_PROJECTION.monthlyRate, 1);
  assert.equal(VEHICLE_CARD_PROJECTION.weeklyRate, 1);
  assert.equal(VEHICLE_CARD_PROJECTION.dailyRate, 1);
});
