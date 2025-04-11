
/**
 * 用户查询相关功能
 */
import { Tables } from '../../lib/databaseSchema';
import * as db from '../../lib/database';
import { User, UserRole } from './types';
import { getCurrentUser } from './auth';

/**
 * 获取所有用户（仅限管理员）
 * @returns 用户数组
 */
export const getAllUsers = (): User[] => {
  const currentUser = getCurrentUser();
  if (currentUser?.role !== UserRole.ADMIN) {
    return [];
  }
  return db.getAll<User>(Tables.USERS);
};

/**
 * 获取用户信息（通过ID）
 * @param userId 用户ID
 * @returns 用户信息或null
 */
export const getUserById = (userId: string): User | null => {
  return db.getById<User>(Tables.USERS, userId);
};

/**
 * 检查是否是管理员
 * @returns 是否是管理员
 */
export const isAdmin = (): boolean => {
  const currentUser = getCurrentUser();
  return currentUser?.role === UserRole.ADMIN;
};

/**
 * 检查是否是编辑
 * @returns 是否是编辑或管理员
 */
export const isEditor = (): boolean => {
  const currentUser = getCurrentUser();
  return currentUser?.role === UserRole.EDITOR || currentUser?.role === UserRole.ADMIN;
};
