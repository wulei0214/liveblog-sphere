
/**
 * 文章查询相关操作
 */
import { Tables } from '../lib/databaseSchema';
import * as db from '../lib/database';
import { Post } from '../models/Post';

/**
 * 获取所有文章
 * @param includeStatus 包含的文章状态，默认只包含已发布的
 * @returns 文章数组
 */
export const getAllPosts = (includeStatus: ('published' | 'draft' | 'scheduled')[] = ['published']): Post[] => {
  const posts = db.getAll<Post>(Tables.POSTS);
  
  // 默认排序：按创建时间倒序
  let filteredPosts = posts.filter(post => includeStatus.includes(post.status));
  
  // 对于计划发布的文章，检查是否已到发布时间
  const now = new Date();
  filteredPosts = filteredPosts.map(post => {
    if (post.status === 'scheduled' && post.scheduledAt && post.scheduledAt <= now) {
      return { ...post, status: 'published' };
    }
    return post;
  });
  
  return filteredPosts.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

/**
 * 获取单个文章
 * @param id 文章ID
 * @returns 文章对象或null
 */
export const getPostById = (id: string): Post | null => {
  const post = db.getById<Post>(Tables.POSTS, id);
  
  // 对于计划发布的文章，检查是否已到发布时间
  if (post && post.status === 'scheduled' && post.scheduledAt && post.scheduledAt <= new Date()) {
    return { ...post, status: 'published' };
  }
  
  return post;
};

/**
 * 获取用户的文章
 * @param userId 用户ID
 * @param includeStatus 包含的文章状态
 * @returns 文章数组
 */
export const getPostsByUser = (
  userId: string, 
  includeStatus: ('published' | 'draft' | 'scheduled')[] = ['published']
): Post[] => {
  return getAllPosts(includeStatus).filter(post => post.author.id === userId);
};

/**
 * 获取分类下的文章
 * @param categoryId 分类ID
 * @returns 文章数组
 */
export const getPostsByCategory = (categoryId: string): Post[] => {
  return getAllPosts(['published']).filter(post => post.categoryId === categoryId);
};

/**
 * 获取包含特定标签的文章
 * @param tagId 标签ID
 * @returns 文章数组
 */
export const getPostsByTag = (tagId: string): Post[] => {
  return getAllPosts(['published']).filter(post => post.tags.includes(tagId));
};

/**
 * 获取热门文章
 * @param limit 返回数量限制
 * @returns 热门文章数组
 */
export const getPopularPosts = (limit: number = 5): Post[] => {
  return getAllPosts(['published'])
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
};

/**
 * 搜索文章
 * @param query 搜索关键词
 * @returns 符合条件的文章数组
 */
export const searchPosts = (query: string): Post[] => {
  if (!query.trim()) {
    return [];
  }
  
  const lowerQuery = query.toLowerCase();
  
  return getAllPosts(['published']).filter(post => 
    post.title.toLowerCase().includes(lowerQuery) || 
    post.content.toLowerCase().includes(lowerQuery) || 
    post.excerpt.toLowerCase().includes(lowerQuery) || 
    post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};
