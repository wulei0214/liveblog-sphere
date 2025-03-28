
import { Tables } from '../lib/databaseSchema';
import * as db from '../lib/database';

/**
 * 用户数据存储库
 * 提供用户相关的数据操作方法
 */

// 用户角色枚举
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

// 用户类型定义
export interface User {
  id: string;
  username: string;
  password: string; // 实际应用中应该加密存储
  role: UserRole;
  createdAt: Date;
  lastLogin?: Date;
  email?: string;
  avatar?: string;
  bio?: string;
}

// 初始化用户数据
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

// 创建默认管理员用户
const createDefaultAdminUser = () => {
  const adminUser: User = {
    id: '1',
    username: 'admin',
    password: 'admin123', // 实际应用中应使用加密存储
    role: UserRole.ADMIN,
    createdAt: new Date(),
  };
  
  db.create<User>(Tables.USERS, adminUser);
  console.log('已创建默认管理员账户');
};

// 确保用户数据存在
initializeUsersIfEmpty();

// 用户登录服务
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

// 用户注册服务
export const registerUser = (username: string, password: string, email?: string): User | null => {
  // 验证是否为空
  if (!username || !password) {
    return null;
  }
  
  // 检查用户名是否已存在
  const users = db.getAll<User>(Tables.USERS);
  if (users.some((u) => u.username === username)) {
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
  };
  
  // 添加到用户列表
  const createdUser = db.create<User>(Tables.USERS, newUser);
  return createdUser;
};

// 获取当前登录用户
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

// 退出登录
export const logoutUser = (): void => {
  sessionStorage.removeItem('currentUser');
};

// 获取所有用户（仅限管理员）
export const getAllUsers = (): User[] => {
  const currentUser = getCurrentUser();
  if (currentUser?.role !== UserRole.ADMIN) {
    return [];
  }
  return db.getAll<User>(Tables.USERS);
};

// 删除用户（仅限管理员）
export const deleteUser = (userId: string): boolean => {
  const currentUser = getCurrentUser();
  if (currentUser?.role !== UserRole.ADMIN) {
    return false;
  }
  
  return db.remove(Tables.USERS, userId);
};

// 更新用户信息
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

// 检查是否是管理员
export const isAdmin = (): boolean => {
  const currentUser = getCurrentUser();
  return currentUser?.role === UserRole.ADMIN;
};
