
// 重定向到文章存储库，保持向后兼容
export { 
  Post,
  Comment,
  getAllPosts,
  getPostById,
  addPost,
  updatePost,
  deletePost,
  addComment,
  deleteComment
} from '../repositories/postRepository';
