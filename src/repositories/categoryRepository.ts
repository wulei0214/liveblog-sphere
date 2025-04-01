
/**
 * 分类数据存储库
 * 提供分类相关的数据操作方法
 */
import { Tables } from '../lib/databaseSchema';
import * as db from '../lib/database';
import { getCurrentUser } from './userRepository';

// 分类类型定义
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 初始化分类数据
const initializeCategoriesIfEmpty = () => {
  const categories = db.getAll<Category>(Tables.CATEGORIES);
  
  if (categories.length === 0) {
    const sampleCategories: Category[] = [
      {
        id: '1',
        name: '技术',
        slug: 'technology',
        description: '技术相关文章',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: '生活',
        slug: 'life',
        description: '生活随笔',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: '社区',
        slug: 'community',
        description: '社区动态',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    db.createMany<Category>(Tables.CATEGORIES, sampleCategories);
    console.log('已创建样例分类数据');
  }
};

// 确保分类数据存在
initializeCategoriesIfEmpty();

/**
 * 获取所有分类
 * @returns 分类数组
 */
export const getAllCategories = (): Category[] => {
  return db.getAll<Category>(Tables.CATEGORIES);
};

/**
 * 获取单个分类
 * @param id 分类ID
 * @returns 分类对象或null
 */
export const getCategoryById = (id: string): Category | null => {
  return db.getById<Category>(Tables.CATEGORIES, id);
};

/**
 * 获取单个分类（通过别名）
 * @param slug 分类别名
 * @returns 分类对象或null
 */
export const getCategoryBySlug = (slug: string): Category | null => {
  const categories = db.getAll<Category>(Tables.CATEGORIES);
  return categories.find(cat => cat.slug === slug) || null;
};

/**
 * 创建新分类
 * @param name 分类名称
 * @param slug 分类别名
 * @param description 分类描述
 * @param parentId 父分类ID
 * @returns 创建的分类或null
 */
export const createCategory = (
  name: string,
  slug: string,
  description?: string,
  parentId?: string
): Category | null => {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    return null; // 只有管理员可以创建分类
  }
  
  const newCategory: Category = {
    id: Date.now().toString(),
    name,
    slug,
    description,
    parentId,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  return db.create<Category>(Tables.CATEGORIES, newCategory);
};

/**
 * 更新分类
 * @param id 分类ID
 * @param updates 更新数据
 * @returns 更新后的分类或null
 */
export const updateCategory = (
  id: string,
  updates: Partial<Omit<Category, 'id' | 'createdAt'>>
): Category | null => {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    return null; // 只有管理员可以更新分类
  }
  
  return db.update<Category>(Tables.CATEGORIES, id, {
    ...updates,
    updatedAt: new Date()
  });
};

/**
 * 删除分类
 * @param id 分类ID
 * @returns 是否成功
 */
export const deleteCategory = (id: string): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    return false; // 只有管理员可以删除分类
  }
  
  return db.remove(Tables.CATEGORIES, id);
};
