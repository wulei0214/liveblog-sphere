
/**
 * 用户数据存储库
 * 提供用户相关的数据操作方法
 */

import { Tables } from '../lib/databaseSchema';
import * as db from '../lib/database';

/**
 * 用户角色枚举
 * 定义系统中的用户角色类型
 */
export enum UserRole {
  ADMIN = 'admin',   // 管理员角色
  EDITOR = 'editor', // 编辑角色
  USER = 'user',     // 普通用户角色
}

/**
 * 用户类型定义
 * 包含用户的完整信息结构
 */
export interface User {
  id: string;          // 用户唯一标识
  username: string;    // 用户名
  password: string;    // 密码（实际应用中应该加密存储）
  role: UserRole;      // 用户角色
  createdAt: Date;     // 创建时间
  lastLogin?: Date;    // 最后登录时间
  email?: string;      // 电子邮件
  phone?: string;      // 手机号码
  avatar?: string;     // 头像URL
  bio?: string;        // 个人简介
  following?: string[]; // 关注的用户ID列表
  followers?: string[]; // 粉丝ID列表
}

/**
 * 初始化用户数据
 * 如果用户数据为空，则创建默认用户
 */
const initializeUsersIfEmpty = () => {
  const users = db.getAll<User>(Tables.USERS);
  
  if (users.length === 0) {
    // 检查老数据
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers, (key, value) => {
          if (key === 'createdAt') return new Date(value);
          return value;
        });
        // 将旧数据导入到新的数据库结构
        db.createMany<User>(Tables.USERS, parsedUsers);
        console.log('已从旧存储导入用户数据');
      } catch (error) {
        console.error('导入旧用户数据失败', error);
        // 如果导入失败，创建默认管理员账户
        createDefaultAdminUser();
      }
    } else {
      // 没有旧数据，创建默认管理员账户
      createDefaultAdminUser();
    }
  }
};

/**
 * 创建默认管理员用户
 * 系统初始化时使用
 */
const createDefaultAdminUser = () => {
  const adminUser: User = {
    id: '1',
    username: 'admin',
    password: 'admin123', // 实际应用中应使用加密存储
    role: UserRole.ADMIN,
    createdAt: new Date(),
    following: [],
    followers: []
  };
  
  db.create<User>(Tables.USERS, adminUser);
  console.log('已创建默认管理员账户');
};

// 确保用户数据存在
initializeUsersIfEmpty();

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

/**
 * 关注用户
 * @param userId 要关注的用户ID
 * @returns 是否成功
 */
export const followUser = (userId: string): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return false;
  }
  
  // 不能关注自己
  if (currentUser.id === userId) {
    return false;
  }
  
  // 获取目标用户
  const targetUser = getUserById(userId);
  if (!targetUser) {
    return false;
  }
  
  // 检查是否已经关注
  const following = currentUser.following || [];
  if (following.includes(userId)) {
    return true; // 已经关注了
  }
  
  // 更新当前用户的关注列表
  const updatedCurrentUser = db.update<User>(Tables.USERS, currentUser.id, {
    following: [...following, userId]
  });
  
  // 更新目标用户的粉丝列表
  const followers = targetUser.followers || [];
  const updatedTargetUser = db.update<User>(Tables.USERS, userId, {
    followers: [...followers, currentUser.id]
  });
  
  // 更新会话中的当前用户信息
  if (updatedCurrentUser) {
    sessionStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
  }
  
  return !!updatedCurrentUser && !!updatedTargetUser;
};

/**
 * 取消关注用户
 * @param userId 要取消关注的用户ID
 * @returns 是否成功
 */
export const unfollowUser = (userId: string): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return false;
  }
  
  // 获取目标用户
  const targetUser = getUserById(userId);
  if (!targetUser) {
    return false;
  }
  
  // 检查是否已经关注
  const following = currentUser.following || [];
  if (!following.includes(userId)) {
    return true; // 已经没有关注了
  }
  
  // 更新当前用户的关注列表
  const updatedCurrentUser = db.update<User>(Tables.USERS, currentUser.id, {
    following: following.filter(id => id !== userId)
  });
  
  // 更新目标用户的粉丝列表
  const followers = targetUser.followers || [];
  const updatedTargetUser = db.update<User>(Tables.USERS, userId, {
    followers: followers.filter(id => id !== currentUser.id)
  });
  
  // 更新会话中的当前用户信息
  if (updatedCurrentUser) {
    sessionStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
  }
  
  return !!updatedCurrentUser && !!updatedTargetUser;
};

/**
 * 检查是否已关注用户
 * @param userId 用户ID
 * @returns 是否已关注
 */
export const isFollowing = (userId: string): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return false;
  }
  
  const following = currentUser.following || [];
  return following.includes(userId);
};

/**
 * 获取用户关注列表
 * @param userId 用户ID，不传则获取当前用户
 * @returns 关注的用户数组
 */
export const getFollowingUsers = (userId?: string): User[] => {
  const userToCheck = userId ? getUserById(userId) : getCurrentUser();
  if (!userToCheck) {
    return [];
  }
  
  const following = userToCheck.following || [];
  return following.map(id => getUserById(id)).filter((user): user is User => user !== null);
};

/**
 * 获取用户粉丝列表
 * @param userId 用户ID，不传则获取当前用户
 * @returns 粉丝用户数组
 */
export const getFollowers = (userId?: string): User[] => {
  const userToCheck = userId ? getUserById(userId) : getCurrentUser();
  if (!userToCheck) {
    return [];
  }
  
  const followers = userToCheck.followers || [];
  return followers.map(id => getUserById(id)).filter((user): user is User => user !== null);
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
