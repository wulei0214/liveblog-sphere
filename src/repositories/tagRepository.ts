
/**
 * 标签数据存储库
 * 提供标签相关的数据操作方法
 */
import { Tables } from '../lib/databaseSchema';
import * as db from '../lib/database';
import { getCurrentUser } from './userRepository';

// 标签类型定义
export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

// 初始化标签数据
const initializeTagsIfEmpty = () => {
  const tags = db.getAll<Tag>(Tables.TAGS);
  
  if (tags.length === 0) {
    const sampleTags: Tag[] = [
      {
        id: '1',
        name: 'React',
        slug: 'react',
        createdAt: new Date()
      },
      {
        id: '2',
        name: 'JavaScript',
        slug: 'javascript',
        createdAt: new Date()
      },
      {
        id: '3',
        name: '前端',
        slug: 'frontend',
        createdAt: new Date()
      },
      {
        id: '4',
        name: '后端',
        slug: 'backend',
        createdAt: new Date()
      },
      {
        id: '5',
        name: '设计',
        slug: 'design',
        createdAt: new Date()
      }
    ];
    
    db.createMany<Tag>(Tables.TAGS, sampleTags);
    console.log('已创建样例标签数据');
  }
};

// 确保标签数据存在
initializeTagsIfEmpty();

/**
 * 获取所有标签
 * @returns 标签数组
 */
export const getAllTags = (): Tag[] => {
  return db.getAll<Tag>(Tables.TAGS);
};

/**
 * 获取单个标签
 * @param id 标签ID
 * @returns 标签对象或null
 */
export const getTagById = (id: string): Tag | null => {
  return db.getById<Tag>(Tables.TAGS, id);
};

/**
 * 获取单个标签（通过别名）
 * @param slug 标签别名
 * @returns 标签对象或null
 */
export const getTagBySlug = (slug: string): Tag | null => {
  const tags = db.getAll<Tag>(Tables.TAGS);
  return tags.find(tag => tag.slug === slug) || null;
};

/**
 * 创建新标签
 * @param name 标签名称
 * @param slug 标签别名
 * @returns 创建的标签或null
 */
export const createTag = (name: string, slug: string): Tag | null => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return null;
  }
  
  // 检查标签是否已存在
  const existingTag = getTagBySlug(slug);
  if (existingTag) {
    return existingTag;
  }
  
  const newTag: Tag = {
    id: Date.now().toString(),
    name,
    slug,
    createdAt: new Date()
  };
  
  return db.create<Tag>(Tables.TAGS, newTag);
};

/**
 * 删除标签
 * @param id 标签ID
 * @returns 是否成功
 */
export const deleteTag = (id: string): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    return false; // 只有管理员可以删除标签
  }
  
  return db.remove(Tables.TAGS, id);
};

/**
 * 获取热门标签（使用频率最高的标签）
 * @param limit 返回数量限制
 * @returns 热门标签数组
 */
export const getPopularTags = (limit: number = 10): Tag[] => {
  // 在实际应用中，需要根据文章中的标签使用频率计算
  // 这里简单返回所有标签的前N个
  const tags = getAllTags();
  return tags.slice(0, limit);
};
