import test from 'node:test';
import assert from 'node:assert/strict';
import { filterAndSortPosts, paginateItems } from '../src/lib/postListUtils.js';

const posts = [
  { id: '1', title: 'Bravo', excerpt: '组件基础', content: '前端', tags: ['react'], categoryId: 'tech', status: 'published', createdAt: '2024-01-01', updatedAt: '2024-01-03' },
  { id: '2', title: 'Charlie', excerpt: '日常记录', content: '周末', tags: ['life'], categoryId: 'life', status: 'draft', createdAt: '2024-02-01', updatedAt: '2024-02-02' },
  { id: '3', title: 'Alpha', excerpt: '性能优化', content: 'hooks', tags: ['react', 'advanced'], categoryId: 'tech', status: 'published', createdAt: '2024-03-01', updatedAt: '2024-03-02' },
];

test('关键词可匹配标题、摘要、正文和标签', () => {
  assert.deepEqual(filterAndSortPosts(posts, { query: 'hooks' }).map((post) => post.id), ['3']);
  assert.deepEqual(filterAndSortPosts(posts, { query: 'react' }).map((post) => post.id), ['3', '1']);
});

test('状态、分类和标签可以组合筛选', () => {
  const result = filterAndSortPosts(posts, { status: 'published', categoryId: 'tech', tagId: 'react' });
  assert.deepEqual(result.map((post) => post.id), ['3', '1']);
});

test('支持按创建时间、更新时间和标题排序', () => {
  assert.deepEqual(filterAndSortPosts(posts).map((post) => post.id), ['3', '2', '1']);
  assert.deepEqual(filterAndSortPosts(posts, { sortBy: 'oldest' }).map((post) => post.id), ['1', '2', '3']);
  assert.deepEqual(filterAndSortPosts(posts, { sortBy: 'title' }).map((post) => post.id), ['3', '1', '2']);
});

test('分页边界安全，空数据至少保留第 1 页', () => {
  const result = paginateItems(posts, 99, 2);
  assert.equal(result.page, 2);
  assert.equal(result.totalPages, 2);
  assert.deepEqual(result.items.map((post) => post.id), ['1']);
  assert.equal(paginateItems([], 5, 10).page, 1);
});

test('分页只返回当前页且统计范围正确', () => {
  const result = paginateItems(posts, 1, 2);
  assert.equal(result.start, 1);
  assert.equal(result.end, 2);
  assert.equal(result.total, 3);
  assert.deepEqual(result.items.map((post) => post.id), ['1', '2']);
});
