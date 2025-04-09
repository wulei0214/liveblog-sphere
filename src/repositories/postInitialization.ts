
/**
 * 文章数据初始化
 */
import { Tables } from '../lib/databaseSchema';
import * as db from '../lib/database';
import { Post } from '../models/Post';
import { createSamplePosts } from './postSampleData';

/**
 * 初始化文章数据
 */
export const initializePostsIfEmpty = () => {
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
        createAndStoreSamplePosts();
      }
    } else {
      // 没有旧数据，创建样例文章数据
      console.log('没有旧数据，开始创建样例文章');
      createAndStoreSamplePosts();
    }
  } else {
    console.log('数据库已有文章，跳过初始化');
    // 强制重新创建样例数据用于测试
    // 清除现有数据并重新创建
    posts.forEach(post => {
      db.remove(Tables.POSTS, post.id);
    });
    createAndStoreSamplePosts();
    console.log('已重新创建所有样例文章数据');
  }
};

/**
 * 创建并存储样例文章数据
 */
const createAndStoreSamplePosts = () => {
  const samplePosts = createSamplePosts();
  
  console.log('创建样例文章数量:', samplePosts.length);
  samplePosts.forEach(post => {
    console.log(`创建文章: ${post.id} - ${post.title} (状态: ${post.status})`);
  });
  
  db.createMany<Post>(Tables.POSTS, samplePosts);
  console.log('已创建样例文章');
};
