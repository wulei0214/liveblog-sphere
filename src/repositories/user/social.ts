
/**
 * 用户社交关系相关功能
 */
import { Tables } from '../../lib/databaseSchema';
import * as db from '../../lib/database';
import { User } from './types';
import { getCurrentUser } from './auth';
import { getUserById } from './queries';

/**
 * 关注用户
 * @param userId 要关注的用户ID
 * @returns 是否成功
 */
export const followUser = (userId: string): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return false;
  }
  
  // 不能关注自己
  if (currentUser.id === userId) {
    return false;
  }
  
  // 获取目标用户
  const targetUser = getUserById(userId);
  if (!targetUser) {
    return false;
  }
  
  // 检查是否已经关注
  const following = currentUser.following || [];
  if (following.includes(userId)) {
    return true; // 已经关注了
  }
  
  // 更新当前用户的关注列表
  const updatedCurrentUser = db.update<User>(Tables.USERS, currentUser.id, {
    following: [...following, userId]
  });
  
  // 更新目标用户的粉丝列表
  const followers = targetUser.followers || [];
  const updatedTargetUser = db.update<User>(Tables.USERS, userId, {
    followers: [...followers, currentUser.id]
  });
  
  // 更新会话中的当前用户信息
  if (updatedCurrentUser) {
    sessionStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
  }
  
  return !!updatedCurrentUser && !!updatedTargetUser;
};

/**
 * 取消关注用户
 * @param userId 要取消关注的用户ID
 * @returns 是否成功
 */
export const unfollowUser = (userId: string): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return false;
  }
  
  // 获取目标用户
  const targetUser = getUserById(userId);
  if (!targetUser) {
    return false;
  }
  
  // 检查是否已经关注
  const following = currentUser.following || [];
  if (!following.includes(userId)) {
    return true; // 已经没有关注了
  }
  
  // 更新当前用户的关注列表
  const updatedCurrentUser = db.update<User>(Tables.USERS, currentUser.id, {
    following: following.filter(id => id !== userId)
  });
  
  // 更新目标用户的粉丝列表
  const followers = targetUser.followers || [];
  const updatedTargetUser = db.update<User>(Tables.USERS, userId, {
    followers: followers.filter(id => id !== currentUser.id)
  });
  
  // 更新会话中的当前用户信息
  if (updatedCurrentUser) {
    sessionStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
  }
  
  return !!updatedCurrentUser && !!updatedTargetUser;
};

/**
 * 检查是否已关注用户
 * @param userId 用户ID
 * @returns 是否已关注
 */
export const isFollowing = (userId: string): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return false;
  }
  
  const following = currentUser.following || [];
  return following.includes(userId);
};

/**
 * 获取用户关注列表
 * @param userId 用户ID，不传则获取当前用户
 * @returns 关注的用户数组
 */
export const getFollowingUsers = (userId?: string): User[] => {
  const userToCheck = userId ? getUserById(userId) : getCurrentUser();
  if (!userToCheck) {
    return [];
  }
  
  const following = userToCheck.following || [];
  return following.map(id => getUserById(id)).filter((user): user is User => user !== null);
};

/**
 * 获取用户粉丝列表
 * @param userId 用户ID，不传则获取当前用户
 * @returns 粉丝用户数组
 */
export const getFollowers = (userId?: string): User[] => {
  const userToCheck = userId ? getUserById(userId) : getCurrentUser();
  if (!userToCheck) {
    return [];
  }
  
  const followers = userToCheck.followers || [];
  return followers.map(id => getUserById(id)).filter((user): user is User => user !== null);
};
