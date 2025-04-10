/**
 * 数据库架构定义
 * 
 * 此文件定义了博客系统所需的数据库表和字段结构
 * 当前使用本地存储模拟，未来可替换为真实数据库
 */

/**
 * 用户表结构
 * 存储用户信息
 */
export interface UserTable {
  id: string;         // 用户唯一标识
  username: string;   // 用户名
  password: string;   // 密码（实际应用中应该加密存储）
  role: string;       // 用户角色（admin/user/editor）
  createdAt: Date;    // 创建时间
  updatedAt: Date;    // 更新时间
  lastLogin?: Date;   // 最后登录时间
  email?: string;     // 电子邮件
  phone?: string;     // 手机号码
  avatar?: string;    // 头像URL
  bio?: string;       // 个人简介
  following?: string[]; // 关注的用户ID列表
  followers?: string[]; // 粉丝ID列表
}

/**
 * 文章表结构
 * 存储博客文章
 */
export interface PostTable {
  id: string;           // 文章唯一标识
  title: string;        // 文章标题
  content: string;      // 文章内容
  excerpt: string;      // 文章摘要
  author: {             // 作者信息
    id: string;         // 作者ID
    username: string;   // 作者用户名
  };
  createdAt: Date;      // 创建时间
  updatedAt: Date;      // 更新时间
  tags: string[];       // 标签列表
  categoryId?: string;  // 分类ID
  image?: string;       // 特色图片URL
  readTime?: number;    // 阅读时间（分钟）
  views: number;        // 浏览次数
  likes: string[];      // 点赞用户ID列表
  comments: CommentTable[]; // 评论列表
  status: 'published' | 'draft' | 'scheduled'; // 文章状态
  scheduledAt?: Date;   // 定时发布时间
}

/**
 * 评论表结构
 * 存储文章评论
 */
export interface CommentTable {
  id: string;         // 评论唯一标识
  content: string;    // 评论内容
  author: {           // 评论作者
    id: string;       // 作者ID
    username: string; // 作者用户名
  };
  createdAt: Date;    // 创建时间
  parentId?: string;  // 父评论ID（用于回复功能）
}

/**
 * 分类表结构
 * 存储文章分类
 */
export interface CategoryTable {
  id: string;         // 分类唯一标识
  name: string;       // 分类名称
  slug: string;       // URL友好的别名
  description?: string; // 分类描述
  parentId?: string;  // 父分类ID（用于多级分类）
  createdAt: Date;    // 创建时间
  updatedAt: Date;    // 更新时间
}

/**
 * 标签表结构
 * 存储文章标签
 */
export interface TagTable {
  id: string;         // 标签唯一标识
  name: string;       // 标签名称
  slug: string;       // URL友好的别名
  createdAt: Date;    // 创建时间
}

/**
 * 系统设置表结构
 * 存储全局配置
 */
export interface SettingTable {
  key: string;        // 配置键
  value: string;      // 配置值
  type: string;       // 值类型（string/number/boolean/json）
  description: string; // 配置描述
  updatedAt: Date;    // 更新时间
}

/**
 * 用户活动日志表结构
 * 记录用户活动
 */
export interface ActivityLogTable {
  id: string;         // 日志唯一标识
  userId: string;     // 用户ID
  action: string;     // 操作类型
  details: string;    // 详细信息
  ip?: string;        // IP地址
  userAgent?: string; // 用户代理
  createdAt: Date;    // 创建时间
}

/**
 * 通知表结构
 * 存储用户通知
 */
export interface NotificationTable {
  id: string;         // 通知唯一标识
  userId: string;     // 接收通知的用户ID
  type: string;       // 通知类型（comment, like, follow等）
  content: string;    // 通知内容
  isRead: boolean;    // 是否已读
  relatedId?: string; // 相关内容ID（如评论ID、文章ID等）
  createdAt: Date;    // 创建时间
}

/**
 * 消息表结构
 * 存储用户私信
 */
export interface MessageTable {
  id: string;         // 消息唯一标识
  senderId: string;   // 发送者ID
  receiverId: string; // 接收者ID
  content: string;    // 消息内容
  isRead: boolean;    // 是否已读
  createdAt: Date;    // 创建时间
}

/**
 * 留言板表结构
 * 存储用户留言
 */
export interface MessageBoardTable {
  id: string;         // 留言唯一标识
  content: string;    // 留言内容
  author: {           // 留言作者
    id: string;       // 作者ID
    username: string; // 作者用户名
  };
  createdAt: Date;    // 创建时间
  type: 'normal' | 'danmaku'; // 留言类型：普通或弹幕
  color?: string;     // 弹幕颜色
}

/**
 * 数据库表名映射
 */
export enum Tables {
  USERS = 'users',
  POSTS = 'posts',
  CATEGORIES = 'categories',
  TAGS = 'tags',
  SETTINGS = 'settings',
  ACTIVITY_LOGS = 'activity_logs',
  NOTIFICATIONS = 'notifications',
  MESSAGES = 'messages',
  MESSAGE_BOARD = 'message_board'  // 新增留言板表
}

/**
 * 数据库初始化函数
 */
export const initializeDatabase = () => {
  console.log('初始化数据库...');
  // 这里可以添加实际的数据库初始化代码
  // 目前我们使用localStorage模拟数据库，所以不需要额外操作
  console.log('数据库结构已定义，准备就绪');
};

// 初始化数据库结构
initializeDatabase();
