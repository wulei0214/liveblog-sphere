
/**
 * 用户数据初始化
 */
import { Tables } from '../../lib/databaseSchema';
import * as db from '../../lib/database';
import { User, UserRole } from './types';

/**
 * 初始化用户数据
 * 如果用户数据为空，则创建默认用户
 */
export const initializeUsersIfEmpty = () => {
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
export const createDefaultAdminUser = () => {
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
