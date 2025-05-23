
/**
 * 用户数据初始化模块
 * 负责在应用首次启动时创建默认用户账号
 */
import { Tables } from '../../lib/databaseSchema';
import * as db from '../../lib/database';
import { User, UserRole } from './types';

/**
 * 初始化默认用户数据
 * 创建测试用户账号
 */
export const initializeUsers = (): void => {
  const users = db.getAll<User>(Tables.USERS);
  
  // 如果已有用户数据，则不需要初始化
  if (users.length > 0) {
    return;
  }
  
  // 创建默认测试账号
  const testUser: User = {
    id: '1',
    username: '测试用户',
    password: 'password123',
    createdAt: new Date(),
    email: 'user@example.com',
    phone: '13800138000', // 测试用户默认手机号
    avatar: '/placeholder.svg', // 默认头像
    bio: '这是一个测试账号',
    role: UserRole.USER, // 默认普通用户角色
    following: [],
    followers: []
  };
  
  // 将默认用户添加到数据库
  db.create<User>(Tables.USERS, testUser);
};

// 初始化用户数据
initializeUsers();
