
/**
 * 用户数据初始化模块
 * 负责在应用首次启动时创建默认用户账号
 */
import { Tables } from '../../lib/databaseSchema';
import * as db from '../../lib/database';
import { User, UserRole } from './types';

/**
 * 初始化默认用户数据
 * 创建管理员账号和测试用户账号
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
    username: 'admin',  // 管理员用户名固定为admin
    password: 'admin123',
    role: UserRole.ADMIN,
    createdAt: new Date(),
    lastLogin: new Date(),
    email: 'admin@example.com',
    phone: 'admin',  // 管理员手机号固定为admin，用于特殊登录
    avatar: '/placeholder.svg', // 默认头像
    bio: '系统管理员',
    following: [],
    followers: []
  };
  
  // 创建默认测试账号
  const testUser: User = {
    id: '2',
    username: '测试用户',
    password: 'password123',
    role: UserRole.USER,
    createdAt: new Date(),
    email: 'user@example.com',
    phone: '13800138000', // 测试用户默认手机号
    avatar: '/placeholder.svg', // 默认头像
    bio: '这是一个测试账号',
    following: [],
    followers: []
  };
  
  // 将默认用户添加到数据库
  db.create<User>(Tables.USERS, adminUser);
  db.create<User>(Tables.USERS, testUser);
};

// 初始化用户数据
initializeUsers();
