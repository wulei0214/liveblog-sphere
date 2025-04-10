
/**
 * 留言板消息模型定义
 */
export interface BoardMessage {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
  };
  createdAt: Date;
  type: 'normal' | 'danmaku'; // 消息类型：普通留言或弹幕
  color?: string; // 弹幕颜色
}
