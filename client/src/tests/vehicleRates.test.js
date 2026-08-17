import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getAvailableVehicleRates,
  getSelectedVehicleRate
} from '../utils/vehicleRates.js';

test('vehicle pricing defaults to month, followed by week and day', () => {
  const rates = getAvailableVehicleRates({
    monthlyRate: 280000,
    weeklyRate: 78000,
    dailyRate: 12000
  });

  assert.deepEqual(rates.map((rate) => rate.id), ['month', 'week', 'day']);
  assert.equal(getSelectedVehicleRate(rates, null).amount, 280000);
  assert.equal(getSelectedVehicleRate(rates, null).suffix, '/ month');
});

test('selecting a duration returns its matching vehicle rate', () => {
  const rates = getAvailableVehicleRates({
    monthlyRate: 280000,
    weeklyRate: 78000,
    dailyRate: 12000
  });

  assert.equal(getSelectedVehicleRate(rates, 'week').amount, 78000);
  assert.equal(getSelectedVehicleRate(rates, 'day').amount, 12000);
});

test('missing and zero rates are hidden and the first available rate is displayed', () => {
  const weeklyFirst = getAvailableVehicleRates({
    monthlyRate: 0,
    weeklyRate: '65000',
    dailyRate: 10000
  });

  assert.deepEqual(weeklyFirst.map((rate) => rate.id), ['week', 'day']);
  assert.equal(getSelectedVehicleRate(weeklyFirst, 'month').id, 'week');
  assert.deepEqual(getAvailableVehicleRates({ dailyRate: 7500 }).map((rate) => rate.id), ['day']);
});

test('invalid rate data cannot create a selector option', () => {
  const rates = getAvailableVehicleRates({
    monthlyRate: null,
    weeklyRate: 'not-a-number',
    dailyRate: -1
  });

  assert.deepEqual(rates, []);
  assert.equal(getSelectedVehicleRate(rates, 'day'), null);
});
