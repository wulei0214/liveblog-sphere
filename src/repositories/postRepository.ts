
/**
 * 文章数据存储库
 * 提供文章和评论相关的数据操作方法
 */

// 导出模型定义
export type { Post, Comment } from '../models/Post';

// 导出初始化函数
import { initializePostsIfEmpty } from './postInitialization';

// 导出查询相关的函数
export {
  getAllPosts,
  getPostById,
  getPostsByUser,
  getPostsByCategory,
  getPostsByTag,
  getPopularPosts,
  searchPosts
} from './postQueries';

// 导出修改相关的函数
export {
  addPost,
  updatePost,
  deletePost,
  incrementViews
} from './postMutations';

// 导出交互相关的函数
export {
  likePost,
  hasLiked,
  addComment,
  deleteComment
} from './postInteractions';

// 确保文章数据存在
initializePostsIfEmpty();
