
// 重定向到用户存储库，保持向后兼容
export { 
  UserRole, 
  User,
  loginUser, 
  registerUser, 
  getCurrentUser, 
  logoutUser, 
  getAllUsers, 
  deleteUser, 
  isAdmin,
  updateUser
} from '../repositories/userRepository';
