
/**
 * 初始化用户数据
 */
import { Tables } from '../../lib/databaseSchema';
import * as db from '../../lib/database';
import { User, UserRole } from './types';

/**
 * 初始化默认用户数据
 */
export const initializeUsers = (): void => {
  const users = db.getAll<User>(Tables.USERS);
  
  // 如果已有用户数据，则不需要初始化
  if (users.length > 0) {
    return;
  }
  
  // 创建默认管理员账号
  const adminUser: User = {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: UserRole.ADMIN,
    createdAt: new Date(),
    lastLogin: new Date(),
    email: 'admin@example.com',
    following: [],
    followers: []
  };
  
  // 创建默认测试账号
  const testUser: User = {
    id: '2',
    username: 'user01',
    password: 'password123',
    role: UserRole.USER,
    createdAt: new Date(),
    email: 'user@example.com',
    following: [],
    followers: []
  };
  
  // 将默认用户添加到数据库
  db.create<User>(Tables.USERS, adminUser);
  db.create<User>(Tables.USERS, testUser);
};

// 初始化用户数据
initializeUsers();
