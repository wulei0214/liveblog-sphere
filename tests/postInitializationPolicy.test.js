import test from 'node:test';
import assert from 'node:assert/strict';
import { decideSampleInitialization } from '../src/repositories/postInitializationPolicy.js';

test('seeds demo posts when the storage key does not exist', () => {
  assert.equal(decideSampleInitialization(null), 'seed-samples');
});

test('seeds demo posts when storage contains an empty array', () => {
  assert.equal(decideSampleInitialization('[]'), 'seed-samples');
});

test('preserves any existing post count, including counts different from five', () => {
  for (const raw of ['[{"id":"p1"}]', '[{"id":"p1"},{"id":"p2"}]', '[1,2,3,4,5,6]']) {
    assert.equal(decideSampleInitialization(raw), 'preserve-existing');
  }
});

test('preserves malformed JSON instead of replacing it with demo content', () => {
  assert.equal(decideSampleInitialization('{"broken":'), 'preserve-invalid');
});

test('preserves valid JSON values that are not arrays', () => {
  for (const raw of ['null', '{}', '"posts"', '42']) {
    assert.equal(decideSampleInitialization(raw), 'preserve-invalid');
  }
});
