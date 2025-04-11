
/**
 * 用户数据修改相关功能
 */
import { Tables } from '../../lib/databaseSchema';
import * as db from '../../lib/database';
import { User, UserRole } from './types';
import { getCurrentUser } from './auth';

/**
 * 删除用户（仅限管理员）
 * @param userId 用户ID
 * @returns 是否成功
 */
export const deleteUser = (userId: string): boolean => {
  const currentUser = getCurrentUser();
  if (currentUser?.role !== UserRole.ADMIN) {
    return false;
  }
  
  return db.remove(Tables.USERS, userId);
};

/**
 * 更新用户信息
 * @param userId 用户ID
 * @param updates 更新数据
 * @returns 更新后的用户或null
 */
export const updateUser = (userId: string, updates: Partial<User>): User | null => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('用户未登录');
  }
  
  // 只能更新自己的信息或管理员可以更新所有用户
  if (currentUser.id !== userId && currentUser.role !== UserRole.ADMIN) {
    throw new Error('没有权限更新此用户信息');
  }
  
  return db.update<User>(Tables.USERS, userId, updates);
};

/**
 * 更新用户角色（仅限管理员）
 * @param userId 用户ID
 * @param role 新角色
 * @returns 更新后的用户或null
 */
export const updateUserRole = (userId: string, role: UserRole): User | null => {
  const currentUser = getCurrentUser();
  if (currentUser?.role !== UserRole.ADMIN) {
    throw new Error('只有管理员可以更改用户角色');
  }
  
  return db.update<User>(Tables.USERS, userId, { role });
};
