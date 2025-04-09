
/**
 * 文章修改相关操作
 */
import { Tables } from '../lib/databaseSchema';
import * as db from '../lib/database';
import { Post } from '../models/Post';
import { getCurrentUser, isEditor } from './userRepository';
import { getCategoryById } from './categoryRepository';

/**
 * 添加新文章
 * @param title 标题
 * @param content 内容
 * @param excerpt 摘要
 * @param tags 标签数组
 * @param categoryId 分类ID
 * @param image 特色图片URL
 * @param status 状态
 * @param scheduledAt 计划发布时间
 * @returns 创建的文章或null
 */
export const addPost = (
  title: string, 
  content: string, 
  excerpt: string, 
  tags: string[] = [],
  categoryId?: string,
  image?: string,
  status: 'published' | 'draft' | 'scheduled' = 'published',
  scheduledAt?: Date
): Post | null => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return null;
  }
  
  // 计算阅读时间（假设每分钟阅读200字）
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  
  // 如果选择了分类，验证分类是否存在
  if (categoryId && !getCategoryById(categoryId)) {
    return null;
  }
  
  const newPost: Post = {
    id: Date.now().toString(),
    title,
    content,
    excerpt,
    author: {
      id: currentUser.id,
      username: currentUser.username,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    tags,
    categoryId,
    image,
    readTime,
    views: 0,
    likes: [],
    comments: [],
    status,
    scheduledAt: status === 'scheduled' ? scheduledAt : undefined
  };
  
  return db.create<Post>(Tables.POSTS, newPost);
};

/**
 * 更新文章
 * @param id 文章ID
 * @param updates 更新数据
 * @returns 更新后的文章或null
 */
export const updatePost = (
  id: string, 
  updates: Partial<Pick<Post, 'title' | 'content' | 'excerpt' | 'image' | 'tags' | 'categoryId' | 'status' | 'scheduledAt'>>
): Post | null => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return null;
  }
  
  const post = db.getById<Post>(Tables.POSTS, id);
  if (!post) {
    return null;
  }
  
  // 检查是否为作者、编辑或管理员
  if (post.author.id !== currentUser.id && !isEditor()) {
    return null;
  }
  
  // 如果更新了内容，重新计算阅读时间
  let readTime = post.readTime;
  if (updates.content) {
    const wordCount = updates.content.trim().split(/\s+/).length;
    readTime = Math.max(1, Math.ceil(wordCount / 200));
  }
  
  // 如果选择了分类，验证分类是否存在
  if (updates.categoryId && !getCategoryById(updates.categoryId)) {
    return null;
  }
  
  return db.update<Post>(Tables.POSTS, id, {
    ...updates,
    readTime,
    updatedAt: new Date(),
  });
};

/**
 * 删除文章
 * @param id 文章ID
 * @returns 是否成功
 */
export const deletePost = (id: string): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return false;
  }
  
  const post = db.getById<Post>(Tables.POSTS, id);
  if (!post) {
    return false;
  }
  
  // 检查是否为作者或管理员
  if (post.author.id !== currentUser.id && currentUser.role !== 'admin') {
    return false;
  }
  
  return db.remove(Tables.POSTS, id);
};

/**
 * 增加文章浏览次数
 * @param id 文章ID
 * @returns 更新后的文章或null
 */
export const incrementViews = (id: string): Post | null => {
  const post = db.getById<Post>(Tables.POSTS, id);
  if (!post) {
    return null;
  }
  
  return db.update<Post>(Tables.POSTS, id, {
    views: post.views + 1
  });
};
