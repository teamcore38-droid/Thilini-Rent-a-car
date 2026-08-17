import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getAdjacentImageIndex,
  getSwipeDirection,
  normalizeVehicleImages
} from '../utils/cardGallery.js';

test('Card gallery: normalizes legacy strings and places the primary image first', () => {
  const images = normalizeVehicleImages([
    'https://cdn.example.com/side.webp',
    { url: 'https://cdn.example.com/front.webp', alt: 'Front view', isPrimary: true },
    { url: 'https://cdn.example.com/rear.webp', alt: 'Rear view' }
  ]);

  assert.deepEqual(
    images.map((image) => image.url),
    [
      'https://cdn.example.com/front.webp',
      'https://cdn.example.com/side.webp',
      'https://cdn.example.com/rear.webp'
    ]
  );
  assert.equal(images[0].alt, 'Front view');
});

test('Card gallery: removes empty and duplicate image URLs', () => {
  const images = normalizeVehicleImages([
    '',
    { url: ' https://cdn.example.com/car.webp ', alt: '' },
    { url: 'https://cdn.example.com/car.webp', alt: 'Car', isPrimary: true },
    null
  ]);

  assert.equal(images.length, 1);
  assert.equal(images[0].url, 'https://cdn.example.com/car.webp');
  assert.equal(images[0].alt, 'Car');
  assert.equal(images[0].isPrimary, true);
});

test('Card gallery: wraps next and previous navigation at both ends', () => {
  assert.equal(getAdjacentImageIndex(0, 3, -1), 2);
  assert.equal(getAdjacentImageIndex(2, 3, 1), 0);
  assert.equal(getAdjacentImageIndex(1, 3, 1), 2);
});

test('Card gallery: maps horizontal finger swipes to navigation direction', () => {
  assert.equal(getSwipeDirection(200, 130), 1, 'swiping left advances');
  assert.equal(getSwipeDirection(100, 170), -1, 'swiping right goes back');
  assert.equal(getSwipeDirection(100, 75), 0, 'small movement remains a click');
  assert.equal(getSwipeDirection(undefined, 75), 0, 'missing touch data is ignored');
});
