
/**
 * 用户认证相关功能
 * 
 * 汇总导出所有认证相关的函数
 */

// 导出登录相关函数
export { loginUser, phoneAuthLogin } from './authLogin';

// 导出注册相关函数
export { registerUser } from './authRegister';

// 导出会话相关函数
export { getCurrentUser, logoutUser, needsNicknameSetup } from './authSession';

// 导出资料相关函数
export { updateUserProfile, updateUserNickname } from './authProfile';
