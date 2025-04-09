
/**
 * 文章交互相关操作（点赞、评论等）
 */
import { Tables } from '../lib/databaseSchema';
import * as db from '../lib/database';
import { Post, Comment } from '../models/Post';
import { getCurrentUser } from './userRepository';

/**
 * 文章点赞
 * @param postId 文章ID
 * @returns 更新后的文章或null
 */
export const likePost = (postId: string): Post | null => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return null;
  }
  
  const post = db.getById<Post>(Tables.POSTS, postId);
  if (!post) {
    return null;
  }
  
  // 检查用户是否已经点赞
  const likes = [...post.likes];
  const userIndex = likes.indexOf(currentUser.id);
  
  if (userIndex !== -1) {
    // 用户已经点赞，取消点赞
    likes.splice(userIndex, 1);
  } else {
    // 用户未点赞，添加点赞
    likes.push(currentUser.id);
  }
  
  return db.update<Post>(Tables.POSTS, postId, { likes });
};

/**
 * 检查用户是否已对文章点赞
 * @param postId 文章ID
 * @returns 是否已点赞
 */
export const hasLiked = (postId: string): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return false;
  }
  
  const post = db.getById<Post>(Tables.POSTS, postId);
  if (!post) {
    return false;
  }
  
  return post.likes.includes(currentUser.id);
};

/**
 * 添加评论
 * @param postId 文章ID
 * @param content 评论内容
 * @param parentId 父评论ID（用于回复功能）
 * @returns 更新后的文章或null
 */
export const addComment = (
  postId: string, 
  content: string,
  parentId?: string
): Post | null => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return null;
  }
  
  const post = db.getById<Post>(Tables.POSTS, postId);
  if (!post) {
    return null;
  }
  
  // 如果提供了父评论ID，检查它是否存在
  if (parentId && !post.comments.some(comment => comment.id === parentId)) {
    return null;
  }
  
  const newComment: Comment = {
    id: Date.now().toString(),
    content,
    author: {
      id: currentUser.id,
      username: currentUser.username,
    },
    createdAt: new Date(),
    parentId
  };
  
  const updatedComments = [...post.comments, newComment];
  
  return db.update<Post>(Tables.POSTS, postId, {
    comments: updatedComments,
  });
};

/**
 * 删除评论
 * @param postId 文章ID
 * @param commentId 评论ID
 * @returns 更新后的文章或null
 */
export const deleteComment = (postId: string, commentId: string): Post | null => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return null;
  }
  
  const post = db.getById<Post>(Tables.POSTS, postId);
  if (!post) {
    return null;
  }
  
  const comment = post.comments.find(c => c.id === commentId);
  if (!comment) {
    return null;
  }
  
  // 检查是否为评论作者、文章作者或管理员
  if (
    comment.author.id !== currentUser.id && 
    post.author.id !== currentUser.id && 
    currentUser.role !== 'admin'
  ) {
    return null;
  }
  
  // 找出所有需要删除的评论（当前评论及其所有回复）
  const commentsToDelete = [commentId];
  
  // 递归查找所有子评论
  const findChildComments = (parentId: string) => {
    post.comments.forEach(c => {
      if (c.parentId === parentId) {
        commentsToDelete.push(c.id);
        findChildComments(c.id);
      }
    });
  };
  
  findChildComments(commentId);
  
  // 过滤掉所有需要删除的评论
  const updatedComments = post.comments.filter(c => !commentsToDelete.includes(c.id));
  
  return db.update<Post>(Tables.POSTS, postId, {
    comments: updatedComments,
  });
};
