/**
 * 文章样例初始化策略。
 *
 * 保持为无副作用的纯函数，便于 Node.js 内置测试直接覆盖边界情况。
 */

/**
 * @param {string | null} rawPosts localStorage 中 posts 键的原始内容
 * @returns {'seed-samples' | 'preserve-existing' | 'preserve-invalid'}
 */
export const decideSampleInitialization = (rawPosts) => {
  if (rawPosts === null) {
    return 'seed-samples';
  }

  let parsed;

  try {
    parsed = JSON.parse(rawPosts);
  } catch {
    return 'preserve-invalid';
  }

  if (!Array.isArray(parsed)) {
    return 'preserve-invalid';
  }

  return parsed.length === 0 ? 'seed-samples' : 'preserve-existing';
};
