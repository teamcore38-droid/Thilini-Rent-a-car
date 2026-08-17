import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createConnectionManager } from '../config/db.js';

process.env.NODE_ENV = 'test';
process.env.VERCEL = '1';

const { default: app, setDatabaseConnectorForTests } = await import('../server.js');
const { Vehicle } = await import('../models/Vehicle.js');
const { Setting } = await import('../models/Setting.js');

test('database-dependent endpoints fail fast with a safe correlated 503', async () => {
  let vehicleQueryCalled = false;
  let settingsQueryCalled = false;
  const originalAggregate = Vehicle.aggregate;
  const originalFindOne = Setting.findOne;
  Vehicle.aggregate = () => {
    vehicleQueryCalled = true;
    throw new Error('controller query should not execute');
  };
  Setting.findOne = () => {
    settingsQueryCalled = true;
    throw new Error('controller query should not execute');
  };
  setDatabaseConnectorForTests(async () => {
    throw new Error('simulated unavailable database');
  });

  try {
    const startedAt = performance.now();
    const [vehicles, settings] = await Promise.all([
      request(app).get('/api/vehicles'),
      request(app).get('/api/settings')
    ]);
    const durationMs = performance.now() - startedAt;

    assert.equal(vehicles.status, 503);
    assert.equal(settings.status, 503);
    assert.equal(vehicles.body.code, 'DATABASE_UNAVAILABLE');
    assert.equal(settings.body.code, 'DATABASE_UNAVAILABLE');
    assert.equal(vehicles.body.requestId, vehicles.headers['x-request-id']);
    assert.equal(settings.body.requestId, settings.headers['x-request-id']);
    assert.equal(vehicleQueryCalled, false);
    assert.equal(settingsQueryCalled, false);
    assert.equal(durationMs < 3000, true, `503 responses took ${durationMs.toFixed(1)}ms`);
  } finally {
    Vehicle.aggregate = originalAggregate;
    Setting.findOne = originalFindOne;
    setDatabaseConnectorForTests(null);
  }
});

test('liveness and readiness never wait for a database connection', async () => {
  let connectionAttempted = false;
  setDatabaseConnectorForTests(async () => {
    connectionAttempted = true;
    throw new Error('should not run for health checks');
  });

  try {
    const liveStartedAt = performance.now();
    const live = await request(app).get('/health/live');
    const liveDurationMs = performance.now() - liveStartedAt;
    const readyStartedAt = performance.now();
    const ready = await request(app).get('/health/ready');
    const readyDurationMs = performance.now() - readyStartedAt;

    assert.equal(live.status, 200);
    assert.equal(ready.status, 503);
    assert.equal(ready.body.database, 'disconnected');
    assert.equal(connectionAttempted, false);
    assert.equal(liveDurationMs < 100, true, `liveness took ${liveDurationMs.toFixed(1)}ms`);
    assert.equal(readyDurationMs < 100, true, `readiness took ${readyDurationMs.toFixed(1)}ms`);
  } finally {
    setDatabaseConnectorForTests(null);
  }
});

test('connection manager deduplicates attempts and reconnects after a drop', async () => {
  const connection = { readyState: 0 };
  let connectCalls = 0;
  let releaseFirstConnection;
  const firstConnection = new Promise((resolve) => {
    releaseFirstConnection = resolve;
  });
  const mongooseClient = {
    connection,
    connect: async () => {
      connectCalls += 1;
      if (connectCalls === 1) await firstConnection;
      connection.readyState = 1;
    }
  };
  const manager = createConnectionManager({
    mongooseClient,
    getUri: () => 'mongodb://example.invalid/test',
    installListeners: false
  });

  const first = manager.connect();
  const concurrent = manager.connect();
  await Promise.resolve();
  assert.equal(connectCalls, 1);
  releaseFirstConnection();
  await Promise.all([first, concurrent]);
  assert.equal(manager.hasPendingConnection(), false);

  connection.readyState = 0;
  await manager.connect();
  assert.equal(connectCalls, 2);
});

test('connection manager clears a rejected promise before retrying', async () => {
  const connection = { readyState: 0 };
  let connectCalls = 0;
  const mongooseClient = {
    connection,
    connect: async () => {
      connectCalls += 1;
      if (connectCalls === 1) throw new Error('first attempt failed');
      connection.readyState = 1;
    }
  };
  const manager = createConnectionManager({
    mongooseClient,
    getUri: () => 'mongodb://example.invalid/test',
    installListeners: false
  });

  await assert.rejects(manager.connect(), /first attempt failed/);
  assert.equal(manager.hasPendingConnection(), false);
  await manager.connect();
  assert.equal(connectCalls, 2);
});
