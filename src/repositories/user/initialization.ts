/**
 * 本地演示用户初始化。只补齐缺失账号，不覆盖已有用户资料。
 * 演示凭据仅用于 Vite 本地开发，不得用于生产环境。
 */
import { Tables } from '../../lib/databaseSchema';
import * as db from '../../lib/database';
import { User, UserRole } from './types';

export const initializeUsers = (): void => {
  const users = db.getAll<User>(Tables.USERS);

  if (!users.some((user) => user.phone === '13800138000')) {
    db.create<User>(Tables.USERS, {
      id: 'demo-user',
      username: '测试用户',
      password: 'password123',
      createdAt: new Date(),
      email: 'user@example.com',
      phone: '13800138000',
      avatar: '/placeholder.svg',
      bio: '本地演示普通用户账号',
      role: UserRole.USER,
      following: [],
      followers: [],
    });
  }

  if (!users.some((user) => user.username === 'admin' && user.role === UserRole.ADMIN)) {
    db.create<User>(Tables.USERS, {
      id: 'demo-admin',
      username: 'admin',
      password: 'AdminDemo@123',
      createdAt: new Date(),
      email: 'admin@local.demo',
      phone: '13900139000',
      avatar: '/placeholder.svg',
      bio: '仅用于本地功能体验的演示管理员',
      role: UserRole.ADMIN,
      following: [],
      followers: [],
    });
  }
};

initializeUsers();
