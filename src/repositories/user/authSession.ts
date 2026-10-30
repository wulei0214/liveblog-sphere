import { User } from './types';

export const notifyLocalAuthChange = (): void => {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('local-auth-change'));
};

export const getCurrentUser = (): User | null => {
  const userStr = sessionStorage.getItem('currentUser');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr, (key, value) => {
      if (key === 'createdAt' || key === 'lastLogin' || key === 'birthDate') return value ? new Date(value) : null;
      return value;
    }) as User;
  } catch (error) {
    console.error('解析当前用户信息失败', error);
    return null;
  }
};

export const setCurrentUser = (user: User): void => {
  sessionStorage.setItem('currentUser', JSON.stringify(user));
  notifyLocalAuthChange();
};

export const logoutUser = (): void => {
  sessionStorage.removeItem('currentUser');
  notifyLocalAuthChange();
};

export const needsNicknameSetup = (user: User | null): boolean => {
  if (!user || !user.username) return false;
  return /^1\d{10}$/.test(user.username);
};
