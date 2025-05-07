
/**
 * 用户数据存储库
 * 提供用户相关的数据操作方法
 */

// 从拆分的文件中导出类型
export { UserRole } from './user/types';
export type { User } from './user/types';

// 导出认证相关方法
export { loginUser, registerUser, updateUserNickname, getCurrentUser, logoutUser } from './user/auth';

// 导出查询相关方法
export { getAllUsers, getUserById, isAdmin, isEditor } from './user/queries';

// 导出修改相关方法
export { deleteUser, updateUser, updateUserRole } from './user/mutations';

// 导出社交关系相关方法
export {
  followUser,
  unfollowUser,
  isFollowing,
  getFollowingUsers,
  getFollowers
} from './user/social';

// 初始化用户数据
import './user/initialization';
