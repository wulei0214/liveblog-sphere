
// 重定向到文章存储库，保持向后兼容
export { 
  getAllPosts,
  getPostById,
  addPost,
  updatePost,
  deletePost,
  addComment,
  deleteComment
} from '../repositories/postRepository';

// 正确导出类型
export type { Post, Comment } from '../repositories/postRepository';
