
/**
 * 用户认证相关功能
 */
import { Tables } from '../../lib/databaseSchema';
import * as db from '../../lib/database';
import { User } from './types';

/**
 * 用户登录服务
 * @param username 用户名
 * @param password 密码
 * @returns 登录成功的用户或null
 */
export const loginUser = (username: string, password: string): User | null => {
  // 验证是否为空
  if (!username || !password) {
    return null;
  }
  
  const users = db.getAll<User>(Tables.USERS);
  const user = users.find(
    (u) => u.username === username && u.password === password
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
 * @param username 用户名
 * @param password 密码
 * @param email 电子邮件
 * @param phone 手机号码
 * @returns 注册成功的用户或null
 */
export const registerUser = (
  username: string, 
  password: string, 
  email?: string,
  phone?: string
): User | null => {
  // 验证是否为空
  if (!username || !password) {
    return null;
  }
  
  // 检查用户名是否已存在
  const users = db.getAll<User>(Tables.USERS);
  if (users.some((u) => u.username === username)) {
    return null;
  }
  
  // 检查邮箱是否已存在
  if (email && users.some((u) => u.email === email)) {
    return null;
  }
  
  // 检查手机号是否已存在
  if (phone && users.some((u) => u.phone === phone)) {
    return null;
  }
  
  // 创建新用户
  const newUser: User = {
    id: Date.now().toString(),
    username: username,
    password: password,
    role: UserRole.USER, // 默认为普通用户角色
    createdAt: new Date(),
    email: email,
    phone: phone,
    following: [],
    followers: []
  };
  
  // 添加到用户列表
  const createdUser = db.create<User>(Tables.USERS, newUser);
  return createdUser;
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
