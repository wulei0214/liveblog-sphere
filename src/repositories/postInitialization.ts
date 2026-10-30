/**
 * 文章数据初始化
 *
 * 仅在文章存储不存在或为空数组时创建演示文章。
 * 已有数据永远不会因样例数量、发布时间或版本变化而被删除。
 */
import { Tables } from '../lib/databaseSchema';
import * as db from '../lib/database';
import { Post } from '../models/Post';
import { createSamplePosts } from './postSampleData';
import { decideSampleInitialization } from './postInitializationPolicy';

/** 损坏数据的原始备份键；绝不覆盖已有备份。 */
const CORRUPT_POSTS_BACKUP_KEY = 'posts.corrupt-backup.v1';

/**
 * 安全初始化文章数据。
 *
 * - 不存在或空数组：首次写入样例文章。
 * - 非空数组：保留所有已有内容。
 * - 非法 JSON 或非数组：保留原值并尽力备份，不自动写入样例。
 */
export const initializePostsIfEmpty = (): void => {
  let rawPosts: string | null;

  try {
    rawPosts = localStorage.getItem(Tables.POSTS);
  } catch (error) {
    console.error('无法读取文章存储，已跳过样例初始化以保护现有数据：', error);
    return;
  }

  const decision = decideSampleInitialization(rawPosts);

  if (decision === 'preserve-existing') {
    console.info('文章存储已有内容，跳过样例初始化。');
    return;
  }

  if (decision === 'preserve-invalid') {
    // localStorage 原始值仍保留在原键。另存备份只是尽力而为，失败也绝不覆盖原值。
    try {
      if (localStorage.getItem(CORRUPT_POSTS_BACKUP_KEY) === null && rawPosts !== null) {
        localStorage.setItem(CORRUPT_POSTS_BACKUP_KEY, rawPosts);
      }
    } catch (backupError) {
      console.error('文章存储备份失败；原始数据仍保留在原存储键中：', backupError);
    }

    console.error(
      '文章存储内容不是有效的 JSON 数组，已跳过样例初始化。请先人工检查或导出备份。'
    );
    return;
  }

  try {
    const samplePosts = createSamplePosts();
    db.createMany<Post>(Tables.POSTS, samplePosts);
    console.info(`首次初始化完成，写入 ${samplePosts.length} 篇演示文章。`);
  } catch (error) {
    // 不进行清空、重试覆盖或回退到其他演示数据。
    console.error('样例文章初始化失败；未执行任何主动清空操作：', error);
  }
};
