
/**
 * 留言板数据存储库
 * 提供留言板相关的数据操作方法
 */

import { v4 as uuidv4 } from 'uuid';
import { Tables } from '../lib/databaseSchema';
import * as db from '../lib/database';
import { getCurrentUser } from './userRepository';
import type { BoardMessage } from '../models/Message';
import { toast } from 'sonner';

/**
 * 获取所有留言
 * @returns 留言数组
 */
export const getAllBoardMessages = (): BoardMessage[] => {
  try {
    const messages = db.getAll<BoardMessage>(Tables.MESSAGE_BOARD);
    // 按创建时间降序排序
    return messages.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('获取留言失败:', error);
    return [];
  }
};

/**
 * 添加新留言
 * @param content 留言内容
 * @param type 留言类型
 * @param color 弹幕颜色（仅弹幕类型时有效）
 * @returns 新留言或null
 */
export const addBoardMessage = (
  content: string, 
  type: 'normal' | 'danmaku' = 'normal',
  color?: string
): BoardMessage | null => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    toast.error('请先登录后再发布留言');
    return null;
  }

  if (!content.trim()) {
    toast.error('留言内容不能为空');
    return null;
  }

  try {
    const newMessage: BoardMessage = {
      id: uuidv4(),
      content: content.trim(),
      author: {
        id: currentUser.id,
        username: currentUser.username
      },
      createdAt: new Date(),
      type,
      color: type === 'danmaku' ? color : undefined
    };

    db.create<BoardMessage>(Tables.MESSAGE_BOARD, newMessage);
    return newMessage;
  } catch (error) {
    console.error('添加留言失败:', error);
    toast.error('留言发布失败，请重试');
    return null;
  }
};

/**
 * 删除留言（仅管理员可用）
 * @param messageId 留言ID
 * @returns 是否成功
 */
export const deleteBoardMessage = (messageId: string): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    toast.error('请先登录');
    return false;
  }

  // 验证是否为管理员
  if (currentUser.role !== 'admin') {
    toast.error('只有管理员可以删除留言');
    return false;
  }

  try {
    const success = db.remove(Tables.MESSAGE_BOARD, messageId);
    if (success) {
      return true;
    } else {
      toast.error('删除失败，留言可能已不存在');
      return false;
    }
  } catch (error) {
    console.error('删除留言失败:', error);
    toast.error('删除失败，请重试');
    return false;
  }
};

// 初始化留言数据（如果为空）
export const initializeMessageBoardIfEmpty = () => {
  const messages = db.getAll<BoardMessage>(Tables.MESSAGE_BOARD);
  
  if (messages.length === 0) {
    console.log('初始化留言板数据');
    
    // 创建示例留言
    const sampleMessages: BoardMessage[] = [
      {
        id: uuidv4(),
        content: '欢迎来到我们的留言板！',
        author: {
          id: '1',
          username: 'admin'
        },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 一周前
        type: 'normal'
      },
      {
        id: uuidv4(),
        content: '这是一条测试弹幕~',
        author: {
          id: '1',
          username: 'admin'
        },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3天前
        type: 'danmaku',
        color: '#ff6b6b'
      }
    ];
    
    db.createMany<BoardMessage>(Tables.MESSAGE_BOARD, sampleMessages);
    console.log('示例留言创建完成');
  }
};

// 确保留言板数据存在
initializeMessageBoardIfEmpty();
