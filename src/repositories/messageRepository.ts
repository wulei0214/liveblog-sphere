
/**
 * 消息数据存储库
 * 提供用户私信相关的数据操作方法
 */
import { Tables } from '../lib/databaseSchema';
import * as db from '../lib/database';
import { getCurrentUser, getUserById } from './userRepository';

/**
 * 消息类型定义
 */
export interface Message {
  id: string;         // 消息唯一标识
  senderId: string;   // 发送者ID
  receiverId: string; // 接收者ID
  content: string;    // 消息内容
  isRead: boolean;    // 是否已读
  createdAt: Date;    // 创建时间
}

/**
 * 初始化消息数据
 */
const initializeMessagesIfEmpty = () => {
  const messages = db.getAll<Message>(Tables.MESSAGES);
  
  if (messages.length === 0) {
    console.log('初始化消息表，暂无默认数据');
  }
};

// 确保消息数据存在
initializeMessagesIfEmpty();

/**
 * 发送消息
 * @param receiverId 接收者ID
 * @param content 消息内容
 * @returns 创建的消息或null
 */
export const sendMessage = (
  receiverId: string,
  content: string
): Message | null => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return null;
  }
  
  // 验证接收者是否存在
  const receiver = getUserById(receiverId);
  if (!receiver) {
    return null;
  }
  
  const newMessage: Message = {
    id: Date.now().toString(),
    senderId: currentUser.id,
    receiverId,
    content,
    isRead: false,
    createdAt: new Date()
  };
  
  return db.create<Message>(Tables.MESSAGES, newMessage);
};

/**
 * 获取与特定用户的对话消息
 * @param userId 用户ID
 * @returns 消息数组
 */
export const getConversation = (userId: string): Message[] => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return [];
  }
  
  return db.getAll<Message>(Tables.MESSAGES)
    .filter(message => 
      (message.senderId === currentUser.id && message.receiverId === userId) ||
      (message.senderId === userId && message.receiverId === currentUser.id)
    )
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};

/**
 * 获取用户对话列表
 * @returns 对话用户数组和未读消息数
 */
export const getConversations = (): { userId: string, unreadCount: number }[] => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return [];
  }
  
  const messages = db.getAll<Message>(Tables.MESSAGES);
  
  // 获取与当前用户有对话的所有用户ID
  const userIds = new Set<string>();
  
  messages.forEach(message => {
    if (message.senderId === currentUser.id) {
      userIds.add(message.receiverId);
    } else if (message.receiverId === currentUser.id) {
      userIds.add(message.senderId);
    }
  });
  
  // 计算每个用户的未读消息数量
  return Array.from(userIds).map(userId => {
    const unreadCount = messages.filter(message => 
      message.senderId === userId && 
      message.receiverId === currentUser.id && 
      !message.isRead
    ).length;
    
    return { userId, unreadCount };
  });
};

/**
 * 将消息标记为已读
 * @param messageId 消息ID
 * @returns 更新后的消息或null
 */
export const markMessageAsRead = (messageId: string): Message | null => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return null;
  }
  
  const message = db.getById<Message>(Tables.MESSAGES, messageId);
  if (!message || message.receiverId !== currentUser.id) {
    return null;
  }
  
  return db.update<Message>(Tables.MESSAGES, messageId, {
    isRead: true
  });
};

/**
 * 将与特定用户的所有消息标记为已读
 * @param userId 用户ID
 * @returns 是否成功
 */
export const markAllMessagesAsRead = (userId: string): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return false;
  }
  
  const messages = getConversation(userId)
    .filter(message => 
      message.senderId === userId && 
      message.receiverId === currentUser.id && 
      !message.isRead
    );
  
  messages.forEach(message => {
    db.update<Message>(Tables.MESSAGES, message.id, {
      isRead: true
    });
  });
  
  return true;
};

/**
 * 获取未读消息总数
 * @returns 未读消息数量
 */
export const getUnreadMessageCount = (): number => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return 0;
  }
  
  return db.getAll<Message>(Tables.MESSAGES)
    .filter(message => 
      message.receiverId === currentUser.id && 
      !message.isRead
    ).length;
};

/**
 * 删除消息
 * @param messageId 消息ID
 * @returns 是否成功
 */
export const deleteMessage = (messageId: string): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return false;
  }
  
  const message = db.getById<Message>(Tables.MESSAGES, messageId);
  if (!message || (message.senderId !== currentUser.id && message.receiverId !== currentUser.id)) {
    return false;
  }
  
  return db.remove(Tables.MESSAGES, messageId);
};
