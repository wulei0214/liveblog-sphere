
/**
 * 文章数据存储库
 * 提供文章和评论相关的数据操作方法
 */
import { Tables } from '../lib/databaseSchema';
import * as db from '../lib/database';
import { getCurrentUser, isEditor } from './userRepository';
import { getCategoryById } from './categoryRepository';

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

/**
 * 初始化文章数据
 */
const initializePostsIfEmpty = () => {
  const posts = db.getAll<Post>(Tables.POSTS);
  
  if (posts.length === 0) {
    // 检查老数据
    const storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
      try {
        const parsedPosts = JSON.parse(storedPosts, (key, value) => {
          if (key === 'createdAt' || key === 'updatedAt') return new Date(value);
          return value;
        });
        
        // 将旧数据导入到新的数据库结构
        db.createMany<Post>(Tables.POSTS, parsedPosts);
        console.log('已从旧存储导入文章数据');
      } catch (error) {
        console.error('导入旧文章数据失败', error);
        // 如果导入失败，创建样例文章数据
        createSamplePosts();
      }
    } else {
      // 没有旧数据，创建样例文章数据
      createSamplePosts();
    }
  }
};

/**
 * 创建样例文章
 */
const createSamplePosts = () => {
  const samplePosts: Post[] = [
    {
      id: '1',
      title: '极简主义：如何简化你的生活和思维',
      content: `
# 极简主义：如何简化你的生活和思维

极简主义不仅仅是一种设计风格，更是一种生活态度。在这个信息爆炸的时代，我们被无数的选择和干扰所包围，学会简化变得尤为重要。

## 什么是真正的极简主义？

极简主义的核心理念是"少即是多"。它鼓励我们专注于真正重要的事物，剔除多余和不必要的干扰。这不是关于拥有更少的物质，而是关于为最有价值的事物腾出空间。

## 如何开始极简生活

1. **审视你的物品**：定期整理你的物品，保留那些真正有用或带给你快乐的东西。
2. **减少数字干扰**：限制社交媒体使用时间，关闭不必要的通知。
3. **简化决策过程**：建立日常惯例，减少日常决策的数量。
4. **学会说"不"**：对不符合你价值观或目标的事情说"不"。

## 极简思维的好处

- **更清晰的思考**：减少干扰后，你会发现自己能够更加专注和清晰地思考问题。
- **减轻焦虑**：较少的选择和责任通常意味着较低的压力和焦虑。
- **提高生产力**：专注于重要的任务，而不是分散注意力在多个不相关的活动上。
- **增强创造力**：给思维留出空间，让创造力自然流动。

极简主义是一段旅程，而不是目的地。它是关于不断审视和调整你的生活，以确保你的时间和精力用在最有意义的事情上。
      `,
      excerpt: '探索极简主义如何帮助你减少生活中的杂乱，专注于真正重要的事物，提升生活质量和内心平静。',
      author: {
        id: '1',
        username: 'admin',
      },
      createdAt: new Date('2023-06-15'),
      updatedAt: new Date('2023-06-15'),
      tags: ['1', '5'],
      categoryId: '2',
      image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?ixlib=rb-1.2.1&auto=format&fit=crop&w=1347&q=80',
      readTime: 5,
      views: 0,
      likes: [],
      comments: [],
      status: 'published'
    },
    {
      id: '2',
      title: '数字时代的专注力：如何在分心的世界中保持注意力',
      content: `
# 数字时代的专注力：如何在分心的世界中保持注意力

在当今的数字时代，我们的注意力成为了最稀缺的资源。社交媒体、即时通讯和无止境的通知使我们很难保持专注。本文探讨了提高专注力的有效策略。

## 专注力的科学

研究表明，人类的大脑并不擅长多任务处理。每次我们从一个任务切换到另一个任务时，都会产生"切换成本"，降低我们的效率和准确性。

## 数字干扰的影响

- **注意力碎片化**：频繁查看手机和社交媒体导致注意力被分割成小块。
- **深度工作能力下降**：习惯于快速切换任务使我们失去了长时间专注的能力。
- **增加焦虑和压力**：信息过载和FOMO(错过恐惧症)增加了心理负担。

## 重获专注力的策略

1. **创建无干扰区域**：指定特定的时间和空间，远离手机和其他电子设备。
2. **采用番茄工作法**：25分钟集中工作，然后休息5分钟。
3. **限制通知**：关闭非紧急应用的通知。
4. **练习正念**：通过冥想等练习增强注意力控制能力。
5. **优化工作环境**：减少视觉和听觉干扰。

## 建立健康的数字习惯

- 设定使用设备的边界（例如，晚餐时不用手机）
- 定期进行"数字排毒"
- 使用专门的应用来阻止分心网站

在这个注意力经济时代，学会保护和培养你的专注力是成功的关键因素。通过有意识地管理你的数字生活，你可以重获对注意力的控制，提高生产力和幸福感。
      `,
      excerpt: '在信息爆炸的时代，我们的注意力不断被分散。本文分享了保持专注、避免数字干扰的实用技巧。',
      author: {
        id: '1',
        username: 'admin',
      },
      createdAt: new Date('2023-07-22'),
      updatedAt: new Date('2023-07-22'),
      tags: ['3', '4'],
      categoryId: '1',
      image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      readTime: 6,
      views: 0,
      likes: [],
      comments: [],
      status: 'published'
    },
  ];
  
  db.createMany<Post>(Tables.POSTS, samplePosts);
  console.log('已创建样例文章');
};

// 确保文章数据存在
initializePostsIfEmpty();

/**
 * 获取所有文章
 * @param includeStatus 包含的文章状态，默认只包含已发布的
 * @returns 文章数组
 */
export const getAllPosts = (includeStatus: ('published' | 'draft' | 'scheduled')[] = ['published']): Post[] => {
  const posts = db.getAll<Post>(Tables.POSTS);
  
  // 默认排序：按创建时间倒序
  let filteredPosts = posts.filter(post => includeStatus.includes(post.status));
  
  // 对于计划发布的文章，检查是否已到发布时间
  const now = new Date();
  filteredPosts = filteredPosts.map(post => {
    if (post.status === 'scheduled' && post.scheduledAt && post.scheduledAt <= now) {
      return { ...post, status: 'published' };
    }
    return post;
  });
  
  return filteredPosts.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

/**
 * 获取单个文章
 * @param id 文章ID
 * @returns 文章对象或null
 */
export const getPostById = (id: string): Post | null => {
  const post = db.getById<Post>(Tables.POSTS, id);
  
  // 对于计划发布的文章，检查是否已到发布时间
  if (post && post.status === 'scheduled' && post.scheduledAt && post.scheduledAt <= new Date()) {
    return { ...post, status: 'published' };
  }
  
  return post;
};

/**
 * 获取用户的文章
 * @param userId 用户ID
 * @param includeStatus 包含的文章状态
 * @returns 文章数组
 */
export const getPostsByUser = (
  userId: string, 
  includeStatus: ('published' | 'draft' | 'scheduled')[] = ['published']
): Post[] => {
  return getAllPosts(includeStatus).filter(post => post.author.id === userId);
};

/**
 * 获取分类下的文章
 * @param categoryId 分类ID
 * @returns 文章数组
 */
export const getPostsByCategory = (categoryId: string): Post[] => {
  return getAllPosts(['published']).filter(post => post.categoryId === categoryId);
};

/**
 * 获取包含特定标签的文章
 * @param tagId 标签ID
 * @returns 文章数组
 */
export const getPostsByTag = (tagId: string): Post[] => {
  return getAllPosts(['published']).filter(post => post.tags.includes(tagId));
};

/**
 * 添加新文章
 * @param title 标题
 * @param content 内容
 * @param excerpt 摘要
 * @param tags 标签数组
 * @param categoryId 分类ID
 * @param image 特色图片URL
 * @param status 状态
 * @param scheduledAt 计划发布时间
 * @returns 创建的文章或null
 */
export const addPost = (
  title: string, 
  content: string, 
  excerpt: string, 
  tags: string[] = [],
  categoryId?: string,
  image?: string,
  status: 'published' | 'draft' | 'scheduled' = 'published',
  scheduledAt?: Date
): Post | null => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return null;
  }
  
  // 计算阅读时间（假设每分钟阅读200字）
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  
  // 如果选择了分类，验证分类是否存在
  if (categoryId && !getCategoryById(categoryId)) {
    return null;
  }
  
  const newPost: Post = {
    id: Date.now().toString(),
    title,
    content,
    excerpt,
    author: {
      id: currentUser.id,
      username: currentUser.username,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    tags,
    categoryId,
    image,
    readTime,
    views: 0,
    likes: [],
    comments: [],
    status,
    scheduledAt: status === 'scheduled' ? scheduledAt : undefined
  };
  
  return db.create<Post>(Tables.POSTS, newPost);
};

/**
 * 更新文章
 * @param id 文章ID
 * @param updates 更新数据
 * @returns 更新后的文章或null
 */
export const updatePost = (
  id: string, 
  updates: Partial<Pick<Post, 'title' | 'content' | 'excerpt' | 'image' | 'tags' | 'categoryId' | 'status' | 'scheduledAt'>>
): Post | null => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return null;
  }
  
  const post = db.getById<Post>(Tables.POSTS, id);
  if (!post) {
    return null;
  }
  
  // 检查是否为作者、编辑或管理员
  if (post.author.id !== currentUser.id && !isEditor()) {
    return null;
  }
  
  // 如果更新了内容，重新计算阅读时间
  let readTime = post.readTime;
  if (updates.content) {
    const wordCount = updates.content.trim().split(/\s+/).length;
    readTime = Math.max(1, Math.ceil(wordCount / 200));
  }
  
  // 如果选择了分类，验证分类是否存在
  if (updates.categoryId && !getCategoryById(updates.categoryId)) {
    return null;
  }
  
  return db.update<Post>(Tables.POSTS, id, {
    ...updates,
    readTime,
    updatedAt: new Date(),
  });
};

/**
 * 删除文章
 * @param id 文章ID
 * @returns 是否成功
 */
export const deletePost = (id: string): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return false;
  }
  
  const post = db.getById<Post>(Tables.POSTS, id);
  if (!post) {
    return false;
  }
  
  // 检查是否为作者或管理员
  if (post.author.id !== currentUser.id && currentUser.role !== 'admin') {
    return false;
  }
  
  return db.remove(Tables.POSTS, id);
};

/**
 * 增加文章浏览次数
 * @param id 文章ID
 * @returns 更新后的文章或null
 */
export const incrementViews = (id: string): Post | null => {
  const post = db.getById<Post>(Tables.POSTS, id);
  if (!post) {
    return null;
  }
  
  return db.update<Post>(Tables.POSTS, id, {
    views: post.views + 1
  });
};

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

/**
 * 获取热门文章
 * @param limit 返回数量限制
 * @returns 热门文章数组
 */
export const getPopularPosts = (limit: number = 5): Post[] => {
  return getAllPosts(['published'])
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
};

/**
 * 搜索文章
 * @param query 搜索关键词
 * @returns 符合条件的文章数组
 */
export const searchPosts = (query: string): Post[] => {
  if (!query.trim()) {
    return [];
  }
  
  const lowerQuery = query.toLowerCase();
  
  return getAllPosts(['published']).filter(post => 
    post.title.toLowerCase().includes(lowerQuery) || 
    post.content.toLowerCase().includes(lowerQuery) || 
    post.excerpt.toLowerCase().includes(lowerQuery) || 
    post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};
