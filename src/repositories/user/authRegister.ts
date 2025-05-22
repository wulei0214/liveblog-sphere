
/**
 * 用户注册相关功能
 */
import { Tables } from '../../lib/databaseSchema';
import * as db from '../../lib/database';
import { User, UserRole } from './types';

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
