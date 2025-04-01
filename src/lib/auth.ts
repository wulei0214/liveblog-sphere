
// 重定向到用户存储库，保持向后兼容
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

// 正确导出类型
export type { User } from '../repositories/userRepository';
