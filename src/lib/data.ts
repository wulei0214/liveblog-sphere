
/**
 * 数据访问层
 * 导出所有数据存储库中的方法和类型，保持向后兼容性
 */

// 文章相关
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

// 用户相关
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

// 分类相关
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

// 标签相关
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

// 通知相关
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

// 消息相关
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
