
/**
 * 用户认证相关功能
 */
import { Tables } from '../../lib/databaseSchema';
import * as db from '../../lib/database';
import { User, UserRole } from './types';

/**
 * 用户登录服务
 * @param phone 手机号码
 * @param password 密码
 * @returns 登录成功的用户或null
 */
export const loginUser = (phone: string, password: string): User | null => {
  // 验证是否为空
  if (!phone || !password) {
    return null;
  }
  
  const users = db.getAll<User>(Tables.USERS);
  const user = users.find(
    (u) => u.phone === phone && u.password === password
  );
  
  if (user) {
    // 更新最后登录时间
    db.update<User>(Tables.USERS, user.id, { 
      lastLogin: new Date() 
    });
    
    // 登录成功，保存当前用户到会话
    const sessionUser = { ...user, lastLogin: new Date() };
    sessionStorage.setItem('currentUser', JSON.stringify(sessionUser));
    return sessionUser;
  }
  
  return null;
};

/**
 * 用户注册服务
 * @param phone 手机号码
 * @param password 密码
 * @returns 注册成功的用户或null
 */
export const registerUser = (
  phone: string, 
  password: string
): User | null => {
  // 验证是否为空
  if (!phone || !password) {
    return null;
  }
  
  // 检查手机号是否符合格式 (简单验证11位数字)
  const phoneRegex = /^1\d{10}$/;
  if (!phoneRegex.test(phone)) {
    throw new Error('请输入正确的手机号码');
  }
  
  // 检查手机号是否已存在
  const users = db.getAll<User>(Tables.USERS);
  if (users.some((u) => u.phone === phone)) {
    throw new Error('该手机号已被注册');
  }
  
  // 创建新用户，使用手机号作为username
  const newUser: User = {
    id: Date.now().toString(),
    username: phone, // 默认使用手机号作为用户名
    password: password,
    phone: phone,
    role: UserRole.USER, // 默认为普通用户角色
    createdAt: new Date(),
    following: [],
    followers: []
  };
  
  // 添加到用户列表
  const createdUser = db.create<User>(Tables.USERS, newUser);
  return createdUser;
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

/**
 * 获取当前登录用户
 * @returns 当前登录用户或null
 */
export const getCurrentUser = (): User | null => {
  const userStr = sessionStorage.getItem('currentUser');
  if (!userStr) return null;
  
  try {
    const user = JSON.parse(userStr, (key, value) => {
      if (key === 'createdAt' || key === 'lastLogin') return value ? new Date(value) : null;
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
