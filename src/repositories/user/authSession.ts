
/**
 * 用户会话相关功能
 */
import { Tables } from '../../lib/databaseSchema';
import { User } from './types';

/**
 * 获取当前登录用户
 * @returns 当前登录用户或null
 */
export const getCurrentUser = (): User | null => {
  const userStr = sessionStorage.getItem('currentUser');
  if (!userStr) return null;
  
  try {
    const user = JSON.parse(userStr, (key, value) => {
      if (key === 'createdAt' || key === 'lastLogin' || key === 'birthDate') 
        return value ? new Date(value) : null;
      return value;
    });
    return user;
  } catch (error) {
    console.error('解析当前用户信息失败', error);
    return null;
  }
};

/**
 * 退出登录
 */
export const logoutUser = (): void => {
  sessionStorage.removeItem('currentUser');
};

/**
 * 是否需要设置昵称
 * 检查用户名是否是手机号格式，如果是则需要设置昵称
 * @param user 用户对象
 * @returns 是否需要设置昵称
 */
export const needsNicknameSetup = (user: User | null): boolean => {
  if (!user || !user.username) return false;
  return /^1\d{10}$/.test(user.username);
};
