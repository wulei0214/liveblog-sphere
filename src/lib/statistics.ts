
import { getAllPosts, type Post } from '../repositories/postRepository';
import { getAllUsers, UserRole } from '../repositories/userRepository';

/**
 * 统计工具
 * 提供系统数据分析和统计方法
 */

/**
 * 用户统计数据
 */
export interface UserStats {
  total: number;
  admins: number;
  regularUsers: number;
  newUsersLast30Days: number;
  newUsersLast7Days: number;
  activeUsersLast30Days: number;
}

/**
 * 文章统计数据
 */
export interface PostStats {
  total: number;
  totalComments: number;
  avgCommentsPerPost: number;
  avgPostsPerUser: number;
  postsLast30Days: number;
  postsLast7Days: number;
}

/**
 * 系统统计数据
 */
export interface SystemStats {
  userStats: UserStats;
  postStats: PostStats;
}

/**
 * 获取用户统计数据
 * @returns 用户统计信息
 */
export const getUserStats = (): UserStats => {
  const users = getAllUsers();
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);
  
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  
  const newUsersLast30Days = users.filter(user => 
    user.createdAt >= thirtyDaysAgo
  ).length;
  
  const newUsersLast7Days = users.filter(user => 
    user.createdAt >= sevenDaysAgo
  ).length;
  
  const activeUsersLast30Days = users.filter(user => 
    user.lastLogin && new Date(user.lastLogin) >= thirtyDaysAgo
  ).length;
  
  return {
    total: users.length,
    admins: users.filter(user => user.role === UserRole.ADMIN).length,
    regularUsers: users.filter(user => user.role === UserRole.USER).length,
    newUsersLast30Days,
    newUsersLast7Days,
    activeUsersLast30Days
  };
};

/**
 * 获取文章统计数据
 * @returns 文章统计信息
 */
export const getPostStats = (): PostStats => {
  const posts = getAllPosts();
  const users = getAllUsers();
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);
  
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  
  const totalComments = posts.reduce((acc, post) => acc + post.comments.length, 0);
  
  // Fix: Use createdAt instead of date for posts
  const postsLast30Days = posts.filter(post => {
    const postDate = new Date(post.createdAt);
    return postDate >= thirtyDaysAgo;
  }).length;
  
  const postsLast7Days = posts.filter(post => {
    const postDate = new Date(post.createdAt);
    return postDate >= sevenDaysAgo;
  }).length;
  
  return {
    total: posts.length,
    totalComments,
    avgCommentsPerPost: posts.length ? totalComments / posts.length : 0,
    avgPostsPerUser: users.length ? posts.length / users.length : 0,
    postsLast30Days,
    postsLast7Days
  };
};

/**
 * 获取系统整体统计数据
 * @returns 系统统计信息
 */
export const getSystemStats = (): SystemStats => {
  return {
    userStats: getUserStats(),
    postStats: getPostStats()
  };
};

/**
 * 获取特定用户的文章数量
 * @param userId 用户ID
 * @returns 该用户的文章数量
 */
export const getUserPostCount = (userId: string): number => {
  const posts = getAllPosts();
  return posts.filter(post => post.author.id === userId).length;
};

/**
 * 获取特定用户的评论数量
 * @param userId 用户ID
 * @returns 该用户的评论数量
 */
export const getUserCommentCount = (userId: string): number => {
  const posts = getAllPosts();
  let commentCount = 0;
  
  posts.forEach(post => {
    commentCount += post.comments.filter(comment => comment.author.id === userId).length;
  });
  
  return commentCount;
};
