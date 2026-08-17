import test from 'node:test';
import assert from 'node:assert/strict';
import { VEHICLE_CARD_PROJECTION } from '../controllers/vehicleController.js';

test('vehicle card projection limits the gallery to one primary-first image', () => {
  assert.equal(VEHICLE_CARD_PROJECTION.images.$slice[1], 1);
  const imagePipeline = JSON.stringify(VEHICLE_CARD_PROJECTION.images);
  assert.match(imagePipeline, /isPrimary/);
  assert.equal('features' in VEHICLE_CARD_PROJECTION, false);
  assert.equal('deposit' in VEHICLE_CARD_PROJECTION, false);
  assert.equal(VEHICLE_CARD_PROJECTION.featured, 1);
});
