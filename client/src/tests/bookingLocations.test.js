import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  CUSTOMER_SELECTED_LOCATION,
  DEFAULT_SERVICE_TYPE,
  getBookingLocationOptions,
  getServiceLocationConfig,
  isIncompleteCustomLocation
} from '../config/bookingLocations.js';

const managedSettings = {
  bookingLocations: {
    officeLocation: 'Configured Office',
    airportLocation: 'Configured Airport',
    defaultDeliveryLocation: 'Configured Delivery',
    defaultHandoverLocation: 'Configured Handover',
    defaultPickupLocation: 'Configured Pickup',
    defaultDropoffLocation: 'Configured Drop-off'
  }
};

test('Self Drive uses delivery and return/handover fields with managed defaults', () => {
  const config = getServiceLocationConfig(DEFAULT_SERVICE_TYPE, managedSettings);

  assert.equal(config.startLabel, 'Delivery Location');
  assert.equal(config.endLabel, 'Return/Handover Location');
  assert.equal(config.startDefault, 'Configured Delivery');
  assert.equal(config.endDefault, 'Configured Handover');
});

test('With Driver uses independently configurable pickup and drop-off locations', () => {
  const config = getServiceLocationConfig('With Driver', managedSettings);

  assert.equal(config.startLabel, 'Pickup Location');
  assert.equal(config.endLabel, 'Drop-off Location');
  assert.equal(config.startDefault, 'Configured Pickup');
  assert.equal(config.endDefault, 'Configured Drop-off');
});

test('Airport Transfer defaults both editable fields to the managed airport', () => {
  const config = getServiceLocationConfig('Airport Transfer', managedSettings);

  assert.equal(config.startLabel, 'Pickup Location');
  assert.equal(config.endLabel, 'Drop-off Location');
  assert.equal(config.startDefault, 'Configured Airport');
  assert.equal(config.endDefault, 'Configured Airport');
});

test('Wedding and long-term services use delivery and handover terminology', () => {
  for (const serviceType of ['Wedding Hire', 'Long-Term Rental']) {
    const config = getServiceLocationConfig(serviceType, managedSettings);
    assert.equal(config.startLabel, 'Delivery Location');
    assert.equal(config.endLabel, 'Handover Location');
    assert.equal(config.startDefault, 'Configured Delivery');
    assert.equal(config.endDefault, 'Configured Handover');
  }
});

test('every reusable selector includes the office and customer-selected options', () => {
  const options = getBookingLocationOptions(managedSettings);

  assert.equal(options.includes('Configured Office'), true);
  assert.equal(options.includes(CUSTOMER_SELECTED_LOCATION), true);
  assert.equal(isIncompleteCustomLocation(CUSTOMER_SELECTED_LOCATION), true);
  assert.equal(isIncompleteCustomLocation('Customer Hotel, Colombo'), false);
});

test('vehicle detail reservation CTA explicitly opens Self Drive without forcing a location', () => {
  const detailsSource = readFileSync(
    new URL('../pages/VehicleDetailsPage.jsx', import.meta.url),
    'utf8'
  );

  assert.match(detailsSource, /params\.set\('serviceType', 'Self Drive'\)/);
  assert.doesNotMatch(detailsSource, /params\.set\('pickupLocation'/);
});
