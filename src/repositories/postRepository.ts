
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
  console.log('初始化检查: 当前数据库中的文章数量:', posts.length);
  
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
      console.log('没有旧数据，开始创建样例文章');
      createSamplePosts();
    }
  } else {
    console.log('数据库已有文章，跳过初始化');
    // 强制重新创建样例数据用于测试
    // 清除现有数据并重新创建
    posts.forEach(post => {
      db.remove(Tables.POSTS, post.id);
    });
    createSamplePosts();
    console.log('已重新创建所有样例文章数据');
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
    {
      id: '3',
      title: '如何培养创意思维：突破思维局限的7个方法',
      content: `
# 如何培养创意思维：突破思维局限的7个方法

创造力是当今时代最宝贵的技能之一。不管你是艺术家、企业家还是在任何领域工作，创意思维都能帮助你找到创新的解决方案和独特的表达方式。

## 为什么创意思维如此重要？

在这个快速变化的世界里，传统解决方案往往不再适用。创意思维让我们能够：
- 发现新机会
- 解决复杂问题
- 创造独特价值
- 适应不断变化的环境

## 培养创意思维的7个有效方法

### 1. 拥抱好奇心

爱因斯坦曾说："我没有特殊才能，只是狂热地好奇。"保持好奇心意味着不断提问，探索新事物，质疑既定观念。尝试每天问自己至少一个"为什么"或"如果...会怎样"的问题。

### 2. 跨领域学习

最具创造力的想法往往产生在不同领域的交叉点上。如果你是程序员，尝试学习音乐或绘画；如果你是作家，尝试了解科学或数学。将不同领域的知识结合起来，可能会诞生令人惊讶的创新。

### 3. 改变你的环境

环境对创造力有巨大影响。研究表明，在新环境中，大脑更容易产生新连接。尝试在不同的地方工作，重新布置你的工作空间，或者短期旅行来激发创意。

### 4. 接受约束

与普遍认知相反，约束实际上可以提高创造力。当资源有限时，我们被迫更具创意地思考。尝试设定一些限制条件（如时间、预算或材料限制）来挑战自己。

### 5. 培养发散思维

发散思维是指产生多种可能解决方案的能力。练习头脑风暴而不评判想法的好坏，目标是数量而非质量。随后，你可以回头审视这些想法，寻找最有价值的选择。

### 6. 拥抱失败

创造性工作必然伴随着失败。每次失败都是学习的机会，帮助你了解什么有效，什么无效。最具创造力的人往往也经历了最多的失败，但他们视失败为过程的一部分，而非终点。

### 7. 给思维留出空间

创意需要时间发酵。当我们过度忙碌时，大脑没有空间进行创造性思考。确保在你的日程中留出时间进行漫步、冥想或只是放空。研究表明，我们最有创意的想法往往出现在放松时刻。

## 结语

创意思维不是与生俱来的天赋，而是一种可以培养的技能。通过以上方法的持续练习，你可以突破思维局限，发掘你的创造潜力。记住，创造力不是关于找到正确答案，而是关于发现新问题和新视角。
      `,
      excerpt: '创造力是现代社会最宝贵的能力之一。本文分享七个实用方法，帮助你突破思维局限，培养创意思维。',
      author: {
        id: '1',
        username: 'admin',
      },
      createdAt: new Date('2023-08-10'),
      updatedAt: new Date('2023-08-10'),
      tags: ['2', '5'],
      categoryId: '3',
      image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      readTime: 7,
      views: 0,
      likes: [],
      comments: [],
      status: 'published'
    },
    {
      id: '4',
      title: '高效学习的科学：如何在数字时代优化学习方法',
      content: `
# 高效学习的科学：如何在数字时代优化学习方法

在信息爆炸的时代，我们面临着前所未有的学习机会和挑战。了解大脑如何工作以及采用正确的学习策略，可以显著提升学习效率和记忆保留率。

## 大脑如何学习：认知科学的见解

现代认知科学研究表明，有效学习涉及多个关键过程：

1. **注意力集中**：大脑必须首先关注信息才能处理它
2. **信息编码**：将信息转化为大脑可以存储的形式
3. **整合与联系**：将新知识与现有知识建立联系
4. **记忆巩固**：通过复习和应用强化记忆

## 高效学习的关键策略

### 1. 间隔重复

研究表明，与集中学习相比，间隔学习（在一段时间内分散学习会话）可以提高记忆保留率高达50%。使用间隔重复软件或创建自己的复习计划，在最佳时间点复习材料。

### 2. 检索练习

主动测试自己的知识比简单重读更有效。尝试在不看笔记的情况下回忆信息，或者使用闪卡和自测问题。这种"有益困难"强化了记忆痕迹。

### 3. 深度处理

不要仅仅被动吸收信息。与材料积极互动：提出问题，寻找模式，尝试用自己的话解释概念。这种深度加工有助于更持久的理解和记忆。

### 4. 多元学习

利用不同的感官和学习方式：
- 视觉化概念
- 大声解释
- 写出自己的理解
- 讨论或教授他人

这些多样化的方法可以创建更丰富的记忆连接。

### 5. 睡眠与学习

充足的睡眠对记忆巩固至关重要。研究表明，睡眠不仅可以防止遗忘，还可以重组知识，帮助我们发现新的见解和解决方案。

## 数字工具与学习

明智地使用数字工具可以增强学习过程：

- **知识管理系统**：如Notion、Obsidian或Roam Research可以帮助组织和连接笔记
- **间隔重复软件**：如Anki可以优化复习时间
- **专注工具**：如番茄钟技术应用可以管理注意力

然而，也要注意数字干扰带来的挑战，并建立健康的技术使用习惯。

## 结语

高效学习不是关于学习更多，而是关于学习更聪明。通过了解认知科学原理并应用这些基于证据的策略，你可以显著提高学习效率，在这个知识经济时代保持竞争力。记住，成为一个终身学习者不仅关乎掌握特定知识，更关乎培养适应和成长的能力。
      `,
      excerpt: '通过认知科学的视角探索高效学习的方法，从间隔重复到检索练习，帮助你在信息爆炸的时代更聪明地学习。',
      author: {
        id: '1',
        username: 'admin',
      },
      createdAt: new Date('2023-09-05'),
      updatedAt: new Date('2023-09-05'),
      tags: ['1', '3'],
      categoryId: '1',
      image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      readTime: 8,
      views: 0,
      likes: [],
      comments: [],
      status: 'published'
    },
    {
      id: '5',
      title: '冥想入门：科学与实践相结合的指南',
      content: `
# 冥想入门：科学与实践相结合的指南

冥想作为一种古老的修行方式，在当代科学研究的支持下，正在成为现代人应对压力、提升专注力和增进幸福感的有效工具。本指南将帮助你了解冥想的科学基础，并提供实用的入门技巧。

## 冥想的科学基础

近几十年的研究表明，定期冥想可以带来多种生理和心理益处：

- **大脑结构变化**：MRI研究显示，长期冥想者的前额叶皮质（负责注意力和决策）和海马体（记忆中心）密度增加
- **减少应激反应**：降低血压和皮质醇（压力荷尔蒙）水平
- **提高专注力**：增强工作记忆和维持注意力的能力
- **情绪调节**：加强情绪控制和减少焦虑症状

## 初学者指南：如何开始冥想

### 1. 选择适合的冥想类型

不同形式的冥想适合不同的目标和性格：

- **正念冥想**：专注于当下体验，适合想要减少心理噪音的人
- **慈悲冥想**：培养爱心和善意，适合想要改善人际关系的人
- **呼吸冥想**：关注呼吸，是最简单的入门方式
- **身体扫描**：逐步关注身体各部位，适合压力和身体紧张的人

### 2. 创建合适的环境

- 找一个相对安静、不受干扰的空间
- 使用舒适的坐姿（椅子、垫子或凳子）
- 设定一个温和的计时器
- 早晨或晚上固定时间练习效果最佳

### 3. 呼吸冥想基础练习

1. **坐姿准备**：坐直但不僵硬，双手自然放在膝盖或大腿上
2. **闭眼或轻微下视**：减少视觉刺激
3. **关注呼吸**：注意气息在鼻子或腹部的感觉
4. **温和对待走神**：当注意力游移时，不带判断地重新引导回呼吸
5. **从短时间开始**：初学者从5分钟开始，逐渐延长到20分钟

### 4. 常见挑战及应对

- **思绪纷飞**：这是正常的，冥想的目的不是停止思考，而是认识到思考并返回专注点
- **坐立不安**：允许身体适应，或尝试行走冥想
- **期望过高**：冥想是一项技能，需要时间培养，不要期待立竿见影的效果

## 建立持续的习惯

- **融入日常**：与现有习惯关联，如早晨刷牙后或睡前
- **使用引导冥想**：初学者可通过应用程序获得指导（如Headspace、Calm等）
- **群体支持**：考虑加入冥想小组或课程
- **追踪进度**：记录每天的冥想时间和体验

## 结语

冥想是一种可以终身受益的练习，不仅可以帮助我们应对当代生活的压力，还能帮助我们更深入地了解自己的思想和情绪。记住，冥想不是追求完美的表现，而是培养温和接纳的态度。即使是每天几分钟的练习，长期坚持也能带来显著的变化。
      `,
      excerpt: '探索冥想的科学基础和实用入门方法，了解如何通过简单的日常练习减轻压力、提高专注力和培养内心平静。',
      author: {
        id: '1',
        username: 'admin',
      },
      createdAt: new Date('2023-10-12'),
      updatedAt: new Date('2023-10-12'),
      tags: ['2', '4'],
      categoryId: '2',
      image: 'https://images.unsplash.com/photo-1536623975707-c4b3b2af565d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      readTime: 6,
      views: 0,
      likes: [],
      comments: [],
      status: 'published'
    }
  ];
  
  console.log('创建样例文章数量:', samplePosts.length);
  samplePosts.forEach(post => {
    console.log(`创建文章: ${post.id} - ${post.title} (状态: ${post.status})`);
  });
  
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
  
  // 如果选择了分类，验证分类是否��在
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
