
/**
 * 用户认证相关功能
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

/**
 * 更新用户个人资料
 * @param userId 用户ID
 * @param userData 更新的用户数据
 * @returns 更新后的用户或null
 */
export const updateUserProfile = (
  userId: string, 
  userData: {
    username?: string;
    avatar?: string;
    bio?: string;
    birthDate?: Date;
  }
): User | null => {
  if (!userId) {
    return null;
  }
  
  // 如果有用户名，确保非空
  if (userData.username !== undefined && userData.username.trim().length === 0) {
    throw new Error('昵称不能为空');
  }
  
  return db.update<User>(Tables.USERS, userId, userData);
};

/**
 * 更新用户昵称
 * @param userId 用户ID
 * @param nickname 新昵称
 * @returns 更新后的用户或null
 */
export const updateUserNickname = (userId: string, nickname: string): User | null => {
  if (!nickname || nickname.trim().length === 0) {
    throw new Error('昵称不能为空');
  }
  
  return db.update<User>(Tables.USERS, userId, { username: nickname });
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
      if (key === 'createdAt' || key === 'lastLogin' || key === 'birthDate') 
        return value ? new Date(value) : null;
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
 * 是否需要设置昵称
 * 检查用户名是否是手机号格式，如果是则需要设置昵称
 * @param user 用户对象
 * @returns 是否需要设置昵称
 */
export const needsNicknameSetup = (user: User | null): boolean => {
  if (!user || !user.username) return false;
  return /^1\d{10}$/.test(user.username);
};
