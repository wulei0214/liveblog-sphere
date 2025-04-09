
/**
 * 文章相关的数据模型定义
 */

/**
 * 文章类型定义
 */
export interface Post {
  id: string;                   // 文章唯一标识
  title: string;                // 文章标题
  content: string;              // 文章内容
  excerpt: string;              // 文章摘要
  author: {                     // 作者信息
    id: string;                 // 作者ID
    username: string;           // 作者用户名
  };
  createdAt: Date;              // 创建时间
  updatedAt: Date;              // 更新时间
  tags: string[];               // 标签数组
  categoryId?: string;          // 分类ID
  image?: string;               // 特色图片URL
  readTime?: number;            // 阅读时间
  views: number;                // 浏览次数
  likes: string[];              // 点赞用户ID数组
  comments: Comment[];          // 评论数组
  status: 'published' | 'draft' | 'scheduled'; // 文章状态
  scheduledAt?: Date;           // 计划发布时间
}

/**
 * 评论类型定义
 */
export interface Comment {
  id: string;           // 评论唯一标识
  content: string;      // 评论内容
  author: {             // 评论作者
    id: string;         // 作者ID
    username: string;   // 作者用户名
  };
  createdAt: Date;      // 创建时间
  parentId?: string;    // 父评论ID（用于回复功能）
}
