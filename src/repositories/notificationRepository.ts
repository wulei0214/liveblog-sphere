
/**
 * 通知数据存储库
 * 提供用户通知相关的数据操作方法
 */
import { Tables } from '../lib/databaseSchema';
import * as db from '../lib/database';
import { getCurrentUser } from './userRepository';

/**
 * 通知类型定义
 */
export interface Notification {
  id: string;         // 通知唯一标识
  userId: string;     // 接收通知的用户ID
  type: 'comment' | 'like' | 'follow' | 'system'; // 通知类型
  content: string;    // 通知内容
  isRead: boolean;    // 是否已读
  relatedId?: string; // 相关内容ID（文章ID、评论ID等）
  createdAt: Date;    // 创建时间
}

/**
 * 初始化通知数据
 */
const initializeNotificationsIfEmpty = () => {
  const notifications = db.getAll<Notification>(Tables.NOTIFICATIONS);
  
  if (notifications.length === 0) {
    console.log('初始化通知表，暂无默认数据');
  }
};

// 确保通知数据存在
initializeNotificationsIfEmpty();

/**
 * 创建通知
 * @param userId 接收通知的用户ID
 * @param type 通知类型
 * @param content 通知内容
 * @param relatedId 相关内容ID
 * @returns 创建的通知或null
 */
export const createNotification = (
  userId: string,
  type: 'comment' | 'like' | 'follow' | 'system',
  content: string,
  relatedId?: string
): Notification | null => {
  const newNotification: Notification = {
    id: Date.now().toString(),
    userId,
    type,
    content,
    isRead: false,
    relatedId,
    createdAt: new Date()
  };
  
  return db.create<Notification>(Tables.NOTIFICATIONS, newNotification);
};

/**
 * 获取用户的通知
 * @param limit 返回数量限制
 * @param unreadOnly 是否只返回未读通知
 * @returns 通知数组
 */
export const getUserNotifications = (
  limit: number = 0,
  unreadOnly: boolean = false
): Notification[] => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return [];
  }
  
  let notifications = db.getAll<Notification>(Tables.NOTIFICATIONS)
    .filter(notification => notification.userId === currentUser.id);
  
  if (unreadOnly) {
    notifications = notifications.filter(notification => !notification.isRead);
  }
  
  // 按创建时间排序（最新的在前）
  notifications = notifications.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // 如果指定了限制数量，则进行截取
  if (limit > 0) {
    notifications = notifications.slice(0, limit);
  }
  
  return notifications;
};

/**
 * 获取未读通知数量
 * @returns 未读通知数量
 */
export const getUnreadNotificationCount = (): number => {
  return getUserNotifications(0, true).length;
};

/**
 * 将通知标记为已读
 * @param notificationId 通知ID
 * @returns 更新后的通知或null
 */
export const markNotificationAsRead = (notificationId: string): Notification | null => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return null;
  }
  
  const notification = db.getById<Notification>(Tables.NOTIFICATIONS, notificationId);
  if (!notification || notification.userId !== currentUser.id) {
    return null;
  }
  
  return db.update<Notification>(Tables.NOTIFICATIONS, notificationId, {
    isRead: true
  });
};

/**
 * 将所有通知标记为已读
 * @returns 是否成功
 */
export const markAllNotificationsAsRead = (): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return false;
  }
  
  const unreadNotifications = getUserNotifications(0, true);
  
  unreadNotifications.forEach(notification => {
    db.update<Notification>(Tables.NOTIFICATIONS, notification.id, {
      isRead: true
    });
  });
  
  return true;
};

/**
 * 删除通知
 * @param notificationId 通知ID
 * @returns 是否成功
 */
export const deleteNotification = (notificationId: string): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return false;
  }
  
  const notification = db.getById<Notification>(Tables.NOTIFICATIONS, notificationId);
  if (!notification || notification.userId !== currentUser.id) {
    return false;
  }
  
  return db.remove(Tables.NOTIFICATIONS, notificationId);
};

/**
 * 清空所有通知
 * @returns 是否成功
 */
export const clearAllNotifications = (): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return false;
  }
  
  const notifications = getUserNotifications();
  
  notifications.forEach(notification => {
    db.remove(Tables.NOTIFICATIONS, notification.id);
  });
  
  return true;
};
