
/**
 * 用户登录相关功能
 */
import { Tables } from '../../lib/databaseSchema';
import * as db from '../../lib/database';
import { User, UserRole } from './types';

/**
 * 用户登录服务
 * @param phoneOrAdmin 手机号码或admin标识
 * @param password 密码
 * @returns 登录成功的用户或null
 */
export const loginUser = (phoneOrAdmin: string, password: string): User | null => {
  // 验证是否为空
  if (!phoneOrAdmin || !password) {
    return null;
  }
  
  const users = db.getAll<User>(Tables.USERS);
  
  // 特殊处理admin登录
  if (phoneOrAdmin === 'admin') {
    const adminUser = users.find(
      (u) => u.username === 'admin' && u.password === password && u.role === UserRole.ADMIN
    );
    
    if (adminUser) {
      // 更新最后登录时间
      db.update<User>(Tables.USERS, adminUser.id, { 
        lastLogin: new Date() 
      });
      
      // 登录成功，保存当前用户到会话
      const sessionUser = { ...adminUser, lastLogin: new Date() };
      sessionStorage.setItem('currentUser', JSON.stringify(sessionUser));
      return sessionUser;
    }
    
    return null;
  }
  
  // 常规手机号登录
  const user = users.find(
    (u) => u.phone === phoneOrAdmin && u.password === password
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
 * 手机号验证码登录/注册
 * 如果手机号存在则登录，否则创建新用户并登录
 * 
 * 开发环境下使用固定验证码"123456"
 * @param phone 手机号码
 * @returns 登录/注册成功的用户
 */
export const phoneAuthLogin = (phone: string): User => {
  if (!phone) {
    throw new Error('手机号不能为空');
  }
  
  // 检查手机号是否符合格式 (简单验证11位数字)
  const phoneRegex = /^1\d{10}$/;
  if (!phoneRegex.test(phone)) {
    throw new Error('请输入正确的手机号码');
  }
  
  const users = db.getAll<User>(Tables.USERS);
  let user = users.find(u => u.phone === phone);
  
  // 如果用户不存在，创建新用户
  if (!user) {
    // 创建新用户，使用手机号作为username和默认密码
    const newUser: User = {
      id: Date.now().toString(),
      username: phone, // 默认使用手机号作为用户名
      password: phone, // 默认使用手机号作为密码
      phone: phone,
      role: UserRole.USER, // 默认为普通用户角色
      createdAt: new Date(),
      following: [],
      followers: []
    };
    
    // 添加到用户列表
    user = db.create<User>(Tables.USERS, newUser);
    console.log('开发环境: 创建新用户', user);
  } else {
    console.log('开发环境: 用户已存在，直接登录', user);
  }
  
  // 更新最后登录时间
  db.update<User>(Tables.USERS, user.id, { 
    lastLogin: new Date() 
  });
  
  // 登录成功，保存当前用户到会话
  const sessionUser = { ...user, lastLogin: new Date() };
  sessionStorage.setItem('currentUser', JSON.stringify(sessionUser));
  
  return sessionUser;
};
