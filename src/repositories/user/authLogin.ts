/**
 * 本地演示登录服务。
 */
import { Tables } from '../../lib/databaseSchema';
import * as db from '../../lib/database';
import { User, UserRole } from './types';
import { setCurrentUser } from './authSession';

export const loginUser = (phoneOrAdmin: string, password: string): User | null => {
  if (!phoneOrAdmin || !password) return null;
  const users = db.getAll<User>(Tables.USERS);
  const user = phoneOrAdmin === 'admin'
    ? users.find((candidate) => candidate.username === 'admin' && candidate.password === password && candidate.role === UserRole.ADMIN)
    : users.find((candidate) => candidate.phone === phoneOrAdmin && candidate.password === password);
  if (!user) return null;
  const sessionUser = { ...user, lastLogin: new Date() };
  db.update<User>(Tables.USERS, user.id, { lastLogin: sessionUser.lastLogin });
  setCurrentUser(sessionUser);
  return sessionUser;
};

export const phoneAuthLogin = (phone: string): User => {
  const normalizedPhone = phone.replace(/\D/g, '');
  if (!/^1\d{10}$/.test(normalizedPhone)) {
    throw new Error('本地演示模式目前仅支持 11 位中国大陆手机号');
  }

  const users = db.getAll<User>(Tables.USERS);
  let user = users.find((candidate) => candidate.phone === normalizedPhone);
  if (!user) {
    user = db.create<User>(Tables.USERS, {
      id: 'demo-' + Date.now(),
      username: '用户' + normalizedPhone.slice(-4),
      password: 'local-demo-only',
      phone: normalizedPhone,
      role: UserRole.USER,
      createdAt: new Date(),
      following: [],
      followers: [],
    });
  }

  const sessionUser = { ...user, lastLogin: new Date() };
  db.update<User>(Tables.USERS, user.id, { lastLogin: sessionUser.lastLogin });
  setCurrentUser(sessionUser);
  return sessionUser;
};
