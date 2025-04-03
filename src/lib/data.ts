
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

// 在初次加载时强制创建样例数据
import { Tables } from './databaseSchema';
import * as db from './database';
import { Post } from '../repositories/postRepository';

// 确保首次加载时有5篇文章
(function ensureSamplePosts() {
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
