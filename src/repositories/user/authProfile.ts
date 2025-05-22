
/**
 * 用户资料相关功能
 */
import { Tables } from '../../lib/databaseSchema';
import * as db from '../../lib/database';
import { User } from './types';

/**
 * 更新用户个人资料
 * @param userId 用户ID
 * @param userData 更新的用户数据
 * @returns 更新后的用户或null
 */
export const updateUserProfile = (
  userId: string, 
  userData: {
    username?: string;
    avatar?: string;
    bio?: string;
    birthDate?: Date;
  }
): User | null => {
  if (!userId) {
    return null;
  }
  
  // 如果有用户名，确保非空
  if (userData.username !== undefined && userData.username.trim().length === 0) {
    throw new Error('昵称不能为空');
  }
  
  return db.update<User>(Tables.USERS, userId, userData);
};

/**
 * 更新用户昵称
 * @param userId 用户ID
 * @param nickname 新昵称
 * @returns 更新后的用户或null
 */
export const updateUserNickname = (userId: string, nickname: string): User | null => {
  if (!nickname || nickname.trim().length === 0) {
    throw new Error('昵称不能为空');
  }
  
  return db.update<User>(Tables.USERS, userId, { username: nickname });
};
