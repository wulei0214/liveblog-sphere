
import { Tables } from '../lib/databaseSchema';
import * as db from '../lib/database';
import { getCurrentUser } from '../lib/auth';

/**
 * 文章数据存储库
 * 提供文章相关的数据操作方法
 */

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  content: string;
  date: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  readTime: string;
  image?: string;
  authorId: string;
  authorName: string;
  comments: Comment[];
}

// 初始化文章数据
const initializePostsIfEmpty = () => {
  const posts = db.getAll<Post>(Tables.POSTS);
  if (posts.length === 0) {
    // 从localStorage中检查是否有旧数据
    const storedPosts = localStorage.getItem('blogs');
    if (storedPosts) {
      try {
        const parsedPosts = JSON.parse(storedPosts);
        // 将旧数据导入到新的数据库结构
        db.createMany<Post>(Tables.POSTS, parsedPosts);
        console.log('已从旧存储导入文章数据');
      } catch (error) {
        console.error('导入旧文章数据失败', error);
        // 如果导入失败，创建默认文章
        createDefaultPosts();
      }
    } else {
      // 没有旧数据，创建默认文章
      createDefaultPosts();
    }
  }
};

// 创建默认文章数据
const createDefaultPosts = () => {
  const defaultPosts: Post[] = [
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
      date: '2023-06-15',
      readTime: '5 分钟',
      image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?ixlib=rb-1.2.1&auto=format&fit=crop&w=1347&q=80',
      authorId: '1',
      authorName: 'admin',
      comments: []
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
      date: '2023-07-22',
      readTime: '6 分钟',
      image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      authorId: '1',
      authorName: 'admin',
      comments: []
    },
  ];
  
  db.createMany<Post>(Tables.POSTS, defaultPosts);
  console.log('已创建默认文章数据');
};

// 确保文章数据存在
initializePostsIfEmpty();

// 获取所有文章
export const getAllPosts = (): Post[] => {
  return db.getAll<Post>(Tables.POSTS);
};

// 获取单个文章
export const getPostById = (id: string): Post | undefined => {
  return db.getById<Post>(Tables.POSTS, id);
};

// 添加新文章
export const addPost = (post: Omit<Post, 'id' | 'date' | 'readTime' | 'authorId' | 'authorName' | 'comments'>): Post => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('用户未登录');
  }
  
  const newPost: Post = {
    ...post,
    id: Math.random().toString(36).substring(2, 9),
    date: new Date().toISOString().split('T')[0],
    readTime: `${Math.ceil(post.content.length / 1000)} 分钟`,
    authorId: currentUser.id,
    authorName: currentUser.username,
    comments: []
  };
  
  return db.create<Post>(Tables.POSTS, newPost);
};

// 更新文章
export const updatePost = (
  postId: string, 
  updates: Partial<Pick<Post, 'title' | 'content' | 'excerpt' | 'image'>>
): Post | null => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('用户未登录');
  }
  
  const post = getPostById(postId);
  if (!post) return null;
  
  // 检查是否是作者或管理员
  if (post.authorId !== currentUser.id && currentUser.role !== 'admin') {
    throw new Error('没有权限编辑此文章');
  }
  
  // 如果内容更新了，重新计算阅读时间
  if (updates.content) {
    updates.readTime = `${Math.ceil(updates.content.length / 1000)} 分钟`;
  }
  
  return db.update<Post>(Tables.POSTS, postId, updates);
};

// 删除文章
export const deletePost = (postId: string): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('用户未登录');
  }
  
  const post = getPostById(postId);
  if (!post) return false;
  
  // 检查是否是作者或管理员
  if (post.authorId !== currentUser.id && currentUser.role !== 'admin') {
    throw new Error('没有权限删除此文章');
  }
  
  return db.remove(Tables.POSTS, postId);
};

// 添加评论
export const addComment = (postId: string, content: string): Comment | null => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('用户未登录');
  }
  
  const post = getPostById(postId);
  if (!post) return null;
  
  const newComment: Comment = {
    id: Math.random().toString(36).substring(2, 9),
    postId,
    userId: currentUser.id,
    username: currentUser.username,
    content,
    date: new Date().toISOString().split('T')[0]
  };
  
  post.comments.push(newComment);
  
  db.update<Post>(Tables.POSTS, postId, { comments: post.comments });
  
  return newComment;
};

// 删除评论
export const deleteComment = (postId: string, commentId: string): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('用户未登录');
  }
  
  const post = getPostById(postId);
  if (!post) return false;
  
  const commentIndex = post.comments.findIndex(c => c.id === commentId);
  if (commentIndex === -1) return false;
  
  const comment = post.comments[commentIndex];
  
  // 只有评论作者和管理员可以删除评论
  if (comment.userId !== currentUser.id && currentUser.role !== 'admin') {
    throw new Error('没有权限删除此评论');
  }
  
  post.comments.splice(commentIndex, 1);
  
  db.update<Post>(Tables.POSTS, postId, { comments: post.comments });
  
  return true;
};
