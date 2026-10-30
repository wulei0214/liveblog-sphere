import test from 'node:test';
import assert from 'node:assert/strict';
import { getFavoritePostIds, toggleFavoritePost } from '../src/lib/favorites.js';

const createStorage = () => {
  const values = new Map();
  return {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, value),
  };
};

test('收藏可以添加、取消并持久化', () => {
  const storage = createStorage();
  assert.deepEqual(getFavoritePostIds('user-1', storage), []);
  assert.equal(toggleFavoritePost('user-1', 'post-1', storage), true);
  assert.deepEqual(getFavoritePostIds('user-1', storage), ['post-1']);
  assert.equal(toggleFavoritePost('user-1', 'post-1', storage), false);
  assert.deepEqual(getFavoritePostIds('user-1', storage), []);
});

test('不同用户的收藏列表相互隔离', () => {
  const storage = createStorage();
  toggleFavoritePost('user-1', 'post-1', storage);
  toggleFavoritePost('user-2', 'post-2', storage);
  assert.deepEqual(getFavoritePostIds('user-1', storage), ['post-1']);
  assert.deepEqual(getFavoritePostIds('user-2', storage), ['post-2']);
});

test('损坏数据和无效参数不会导致崩溃', () => {
  const storage = createStorage();
  storage.setItem('liveblog:favorites:user-1', '{broken');
  assert.deepEqual(getFavoritePostIds('user-1', storage), []);
  assert.equal(toggleFavoritePost('', 'post-1', storage), null);
  assert.equal(toggleFavoritePost('user-1', '', storage), null);
});
