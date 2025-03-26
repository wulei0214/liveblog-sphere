
// 用户角色枚举
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

// 用户类型定义
export interface User {
  id: string;
  username: string;
  password: string; // 实际应用中应该加密存储
  role: UserRole;
  createdAt: Date;
}

// 模拟的用户数据存储
let users: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123', // 实际应用中应使用加密存储
    role: UserRole.ADMIN,
    createdAt: new Date(),
  }
];

// 获取本地存储的用户数据
const loadUsers = (): void => {
  const storedUsers = localStorage.getItem('users');
  if (storedUsers) {
    users = JSON.parse(storedUsers, (key, value) => {
      if (key === 'createdAt') return new Date(value);
      return value;
    });
  } else {
    // 首次初始化，存储默认管理员账户
    saveUsers();
  }
};

// 保存用户数据到本地存储
const saveUsers = (): void => {
  localStorage.setItem('users', JSON.stringify(users));
};

// 初始化用户数据
loadUsers();

// 用户登录服务
export const loginUser = (username: string, password: string): User | null => {
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  
  if (user) {
    // 登录成功，保存当前用户到会话
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  
  return null;
};

// 用户注册服务
export const registerUser = (username: string, password: string): User | null => {
  // 检查用户名是否已存在
  if (users.some((u) => u.username === username)) {
    return null;
  }
  
  // 创建新用户
  const newUser: User = {
    id: Date.now().toString(),
    username,
    password,
    role: UserRole.USER, // 默认为普通用户角色
    createdAt: new Date(),
  };
  
  // 添加到用户列表
  users.push(newUser);
  saveUsers();
  
  return newUser;
};

// 获取当前登录用户
export const getCurrentUser = (): User | null => {
  const userStr = sessionStorage.getItem('currentUser');
  if (!userStr) return null;
  
  try {
    const user = JSON.parse(userStr, (key, value) => {
      if (key === 'createdAt') return new Date(value);
      return value;
    });
    return user;
  } catch (error) {
    console.error('解析当前用户信息失败', error);
    return null;
  }
};

// 退出登录
export const logoutUser = (): void => {
  sessionStorage.removeItem('currentUser');
};

// 获取所有用户（仅限管理员）
export const getAllUsers = (): User[] => {
  const currentUser = getCurrentUser();
  if (currentUser?.role !== UserRole.ADMIN) {
    return [];
  }
  return [...users];
};

// 删除用户（仅限管理员）
export const deleteUser = (userId: string): boolean => {
  const currentUser = getCurrentUser();
  if (currentUser?.role !== UserRole.ADMIN) {
    return false;
  }
  
  const initialLength = users.length;
  users = users.filter(user => user.id !== userId);
  
  if (users.length < initialLength) {
    saveUsers();
    return true;
  }
  
  return false;
};

// 检查是否是管理员
export const isAdmin = (): boolean => {
  const currentUser = getCurrentUser();
  return currentUser?.role === UserRole.ADMIN;
};
