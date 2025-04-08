
/**
 * 数据访问层
 * 
 * 集中导出所有数据存储库中的方法和类型
 * 提供统一的数据访问接口，保持向后兼容性
 * 管理数据初始化和样例数据创建
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

// 数据初始化和样例数据管理
import { Tables } from './databaseSchema';
import * as db from './database';
import { Post } from '../repositories/postRepository';

/**
 * 确保示例文章数据存在
 * 在应用首次加载时检查并创建样例数据
 */
(function ensureSamplePosts() {
  // 检查当前文章数量
  const posts = db.getAll<Post>(Tables.POSTS);
  if (posts.length !== 5) {
    console.log('检测到文章数量不足5篇，重新初始化...');
    // 清空现有数据
    posts.forEach(post => {
      db.remove(Tables.POSTS, post.id);
    });
    
    // 触发postRepository中的初始化
    import('../repositories/postRepository').then(repo => {
      console.log('触发文章存储库初始化完成');
    });
  } else {
    console.log('检测到已有5篇文章，无需重新初始化');
  }
})();
