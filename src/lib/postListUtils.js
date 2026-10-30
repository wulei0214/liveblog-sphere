/**
 * 纯函数：文章列表筛选、排序和分页。
 * 不依赖浏览器环境，供首页、管理后台和 Node 测试共同使用。
 */
export function filterAndSortPosts(posts, filters = {}) {
  const query = (filters.query || '').trim().toLocaleLowerCase();
  const status = filters.status || 'all';
  const categoryId = filters.categoryId || 'all';
  const tagId = filters.tagId || 'all';
  const sortBy = filters.sortBy || 'newest';

  const filtered = (Array.isArray(posts) ? posts : []).filter((post) => {
    if (status !== 'all' && post.status !== status) return false;
    if (categoryId !== 'all' && post.categoryId !== categoryId) return false;
    if (tagId !== 'all' && !(post.tags || []).includes(tagId)) return false;

    if (!query) return true;
    const searchable = [post.title, post.excerpt, post.content, ...(post.tags || [])]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase();
    return searchable.includes(query);
  });

  return filtered.sort((a, b) => {
    if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '', 'zh-CN');
    const aDate = new Date(sortBy === 'updated' ? a.updatedAt || a.createdAt : a.createdAt || 0).getTime();
    const bDate = new Date(sortBy === 'updated' ? b.updatedAt || b.createdAt : b.createdAt || 0).getTime();
    return sortBy === 'oldest' ? aDate - bDate : bDate - aDate;
  });
}

export function paginateItems(items, page = 1, pageSize = 10) {
  const safeItems = Array.isArray(items) ? items : [];
  const safePageSize = Math.max(1, Number(pageSize) || 10);
  const total = safeItems.length;
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const currentPage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const startIndex = (currentPage - 1) * safePageSize;
  return {
    items: safeItems.slice(startIndex, startIndex + safePageSize),
    page: currentPage,
    pageSize: safePageSize,
    total,
    totalPages,
    start: total === 0 ? 0 : startIndex + 1,
    end: Math.min(startIndex + safePageSize, total),
  };
}
