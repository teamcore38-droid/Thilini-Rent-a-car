import test from 'node:test';
import assert from 'node:assert';
import bcrypt from 'bcryptjs';

test('Admin Auth: Hashes password and compares correctly', async () => {
  const password = 'Admin@Thilini2026#';
  const hash = await bcrypt.hash(password, 12);
  
  const matches = await bcrypt.compare(password, hash);
  const wrongMatches = await bcrypt.compare('WrongPassword123!', hash);

  assert.strictEqual(matches, true);
  assert.strictEqual(wrongMatches, false);
});
