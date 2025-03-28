
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
  role: string;       // 用户角色（admin/user）
  createdAt: Date;    // 创建时间
  updatedAt: Date;    // 更新时间
  lastLogin: Date;    // 最后登录时间
  email?: string;     // 电子邮件（可选）
  avatar?: string;    // 头像URL（可选）
  bio?: string;       // 个人简介（可选）
}

/**
 * 文章表结构
 * 存储博客文章
 */
export interface PostTable {
  id: string;         // 文章唯一标识
  title: string;      // 文章标题
  content: string;    // 文章内容
  excerpt: string;    // 文章摘要
  date: string;       // 发布日期
  readTime: string;   // 阅读时间
  image?: string;     // 特色图片URL（可选）
  authorId: string;   // 作者ID（关联用户表）
  createdAt: Date;    // 创建时间
  updatedAt: Date;    // 更新时间
  status: string;     // 状态（draft/published）
  viewCount: number;  // 浏览次数
}

/**
 * 评论表结构
 * 存储文章评论
 */
export interface CommentTable {
  id: string;         // 评论唯一标识
  postId: string;     // 关联文章ID
  userId: string;     // 评论者用户ID
  content: string;    // 评论内容
  date: string;       // 评论日期
  createdAt: Date;    // 创建时间
  updatedAt: Date;    // 更新时间
  parentId?: string;  // 父评论ID（用于回复功能，可选）
}

/**
 * 标签表结构
 * 存储文章标签
 */
export interface TagTable {
  id: string;         // 标签唯一标识
  name: string;       // 标签名称
  slug: string;       // 标签别名（URL友好）
  createdAt: Date;    // 创建时间
}

/**
 * 文章-标签关联表结构
 * 管理文章和标签的多对多关系
 */
export interface PostTagTable {
  postId: string;     // 文章ID
  tagId: string;      // 标签ID
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
  ip?: string;        // IP地址（可选）
  userAgent?: string; // 用户代理（可选）
  createdAt: Date;    // 创建时间
}

/**
 * 数据库表名映射
 */
export enum Tables {
  USERS = 'users',
  POSTS = 'posts',
  COMMENTS = 'comments',
  TAGS = 'tags',
  POST_TAGS = 'post_tags',
  SETTINGS = 'settings',
  ACTIVITY_LOGS = 'activity_logs'
}

/**
 * 数据库表创建SQL语句
 * 适用于SQLite或MySQL等关系型数据库
 */
export const DATABASE_SCHEMA = {
  [Tables.USERS]: `
    CREATE TABLE IF NOT EXISTS ${Tables.USERS} (
      id VARCHAR(36) PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'user',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP,
      email VARCHAR(255) UNIQUE,
      avatar TEXT,
      bio TEXT
    );
  `,
  [Tables.POSTS]: `
    CREATE TABLE IF NOT EXISTS ${Tables.POSTS} (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      date VARCHAR(50) NOT NULL,
      read_time VARCHAR(50) NOT NULL,
      image TEXT,
      author_id VARCHAR(36) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(50) NOT NULL DEFAULT 'published',
      view_count INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (author_id) REFERENCES ${Tables.USERS}(id) ON DELETE CASCADE
    );
  `,
  [Tables.COMMENTS]: `
    CREATE TABLE IF NOT EXISTS ${Tables.COMMENTS} (
      id VARCHAR(36) PRIMARY KEY,
      post_id VARCHAR(36) NOT NULL,
      user_id VARCHAR(36) NOT NULL,
      content TEXT NOT NULL,
      date VARCHAR(50) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      parent_id VARCHAR(36),
      FOREIGN KEY (post_id) REFERENCES ${Tables.POSTS}(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES ${Tables.USERS}(id) ON DELETE CASCADE,
      FOREIGN KEY (parent_id) REFERENCES ${Tables.COMMENTS}(id) ON DELETE SET NULL
    );
  `,
  [Tables.TAGS]: `
    CREATE TABLE IF NOT EXISTS ${Tables.TAGS} (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      slug VARCHAR(100) NOT NULL UNIQUE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `,
  [Tables.POST_TAGS]: `
    CREATE TABLE IF NOT EXISTS ${Tables.POST_TAGS} (
      post_id VARCHAR(36) NOT NULL,
      tag_id VARCHAR(36) NOT NULL,
      PRIMARY KEY (post_id, tag_id),
      FOREIGN KEY (post_id) REFERENCES ${Tables.POSTS}(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES ${Tables.TAGS}(id) ON DELETE CASCADE
    );
  `,
  [Tables.SETTINGS]: `
    CREATE TABLE IF NOT EXISTS ${Tables.SETTINGS} (
      key VARCHAR(100) PRIMARY KEY,
      value TEXT NOT NULL,
      type VARCHAR(50) NOT NULL,
      description TEXT NOT NULL,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `,
  [Tables.ACTIVITY_LOGS]: `
    CREATE TABLE IF NOT EXISTS ${Tables.ACTIVITY_LOGS} (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      action VARCHAR(100) NOT NULL,
      details TEXT NOT NULL,
      ip VARCHAR(50),
      user_agent TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES ${Tables.USERS}(id) ON DELETE CASCADE
    );
  `
};

/**
 * 数据库初始化函数（模拟实现）
 * 未来可以替换为实际的数据库连接和初始化逻辑
 */
export const initializeDatabase = () => {
  console.log('初始化数据库...');
  // 这里可以添加实际的数据库初始化代码
  // 目前我们使用localStorage模拟数据库，所以不需要额外操作
  console.log('数据库结构已定义，准备就绪');
};

// 初始化数据库结构
initializeDatabase();
