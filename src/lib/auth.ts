
/**
 * 认证工具库
 * 
 * 提供用户认证相关的工具函数和类型定义
 * 重定向到用户存储库以保持向后兼容性
 */

// 从用户存储库导出认证相关函数，保持向后兼容
export { 
  UserRole, 
  loginUser, 
  registerUser, 
  getCurrentUser, 
  logoutUser, 
  getAllUsers, 
  deleteUser, 
  isAdmin,
  updateUser
} from '../repositories/userRepository';

// 导出用户类型定义
export type { User } from '../repositories/userRepository';
