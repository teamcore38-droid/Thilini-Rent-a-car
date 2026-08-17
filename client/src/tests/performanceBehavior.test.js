import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = (relativePath) => readFileSync(new URL(relativePath, import.meta.url), 'utf8');

test('vehicle detail renders primary data independently and cancels stale requests', () => {
  const details = source('../pages/VehicleDetailsPage.jsx');

  assert.doesNotMatch(details, /Promise\.all\(\[\s*vehicleService\.getVehicleBySlug/);
  assert.match(details, /vehicleService\.getVehicleBySlug\([\s\S]+signal: controller\.signal/);
  assert.match(details, /primaryRequestSequence/);
  assert.match(details, /vehicleRes\?\.vehicle\?\.slug === slug/);
  assert.match(details, /vehicleService\.getSimilarVehicles\(vehicle\.category, slug/);
  assert.match(details, /similarError/);
  assert.match(details, /fetchPriority="high"/);
});

test('fleet keeps a focused cache and background refresh state', () => {
  const fleetPage = source('../pages/FleetPage.jsx');
  const fleetCache = source('../services/fleetCache.js');

  assert.match(fleetPage, /getFleetCacheEntry\(cacheableFleetParams\)/);
  assert.match(fleetPage, /Updating vehicles…/);
  assert.match(fleetPage, /sequence === requestSequence\.current/);
  assert.match(fleetPage, /controller\.abort\(\)/);
  assert.match(fleetCache, /4 \* 60 \* 1000/);
  assert.match(fleetCache, /inFlightRequests/);
  assert.match(fleetCache, /entry\.subscribers\.size === 0/);
  assert.match(fleetCache, /entry\?\.controller\.signal\.aborted/);
});

test('responsive images prioritize only selected cards and the primary detail image', () => {
  const card = source('../components/common/VehicleCard.jsx');
  const details = source('../pages/VehicleDetailsPage.jsx');

  assert.match(card, /getResponsiveImageSrcSet/);
  assert.match(card, /loading=\{priority \? 'eager' : 'lazy'\}/);
  assert.match(card, /fetchPriority=\{priority \? 'high' : 'auto'\}/);
  assert.match(details, /sizes="\(max-width: 1023px\) 100vw, 58vw"/);
  assert.match(details, /width="1200"/);
  assert.match(details, /height="800"/);
});

test('homepage hero preload is route-scoped rather than shared by every HTML route', () => {
  const html = source('../../index.html');
  const hero = source('../components/home/HeroSection.jsx');

  assert.doesNotMatch(html, /rel="preload" as="image"/);
  assert.match(hero, /preloadHomeHero/);
  assert.match(hero, /link\.rel = 'preload'/);
});
