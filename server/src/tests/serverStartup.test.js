import test from 'node:test';
import assert from 'node:assert/strict';

test('Server startup: the complete Express application imports successfully', async () => {
  process.env.NODE_ENV = 'test';
  process.env.VERCEL = '1';

  const { default: app } = await import('../server.js');

  assert.equal(typeof app, 'function');
  assert.equal(typeof app.listen, 'function');
});
