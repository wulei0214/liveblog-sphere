/**
 * 数据访问层
 *
 * 集中导出所有数据存储库中的方法和类型。
 * 文章样例数据只允许由 postRepository 的安全初始化入口在空存储时创建；
 * 此文件不得在模块加载时根据文章数量清空或重建任何用户数据。
 */

// 文章相关方法导出
export {
  getAllPosts,
  getPostById,
  getPostsByUser,
  getPostsByCategory,
  getPostsByTag,
  addPost,
  updatePost,
  deletePost,
  addComment,
  deleteComment,
  incrementViews,
  likePost,
  hasLiked,
  getPopularPosts,
  searchPosts
} from '../repositories/postRepository';

// 导出文章相关类型
export type { Post, Comment } from '../repositories/postRepository';

// 用户相关方法导出
export {
  UserRole,
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
  getAllUsers,
  getUserById,
  deleteUser,
  isAdmin,
  isEditor,
  updateUser,
  updateUserRole,
  followUser,
  unfollowUser,
  isFollowing,
  getFollowingUsers,
  getFollowers
} from '../repositories/userRepository';

// 导出用户相关类型
export type { User } from '../repositories/userRepository';

// 分类相关方法导出
export {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
} from '../repositories/categoryRepository';

// 导出分类相关类型
export type { Category } from '../repositories/categoryRepository';

// 标签相关方法导出
export {
  getAllTags,
  getTagById,
  getTagBySlug,
  createTag,
  deleteTag,
  getPopularTags
} from '../repositories/tagRepository';

// 导出标签相关类型
export type { Tag } from '../repositories/tagRepository';

// 通知相关方法导出
export {
  createNotification,
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications
} from '../repositories/notificationRepository';

// 导出通知相关类型
export type { Notification } from '../repositories/notificationRepository';

// 消息相关方法导出
export {
  sendMessage,
  getConversation,
  getConversations,
  markMessageAsRead,
  markAllMessagesAsRead,
  getUnreadMessageCount,
  deleteMessage
} from '../repositories/messageRepository';

// 导出消息相关类型
export type { Message } from '../repositories/messageRepository';
