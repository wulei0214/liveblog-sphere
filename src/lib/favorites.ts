/**
 * 本地演示收藏数据。
 * 收藏与点赞分离，并按用户 ID 隔离，避免不同账号共用收藏列表。
 */
const STORAGE_PREFIX = 'liveblog:favorites:';

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

const resolveStorage = (storage?: StorageLike): StorageLike | null => {
  if (storage) return storage;
  if (typeof window === 'undefined') return null;
  return window.localStorage;
};

export const getFavoritePostIds = (userId: string, storage?: StorageLike): string[] => {
  if (!userId) return [];
  const target = resolveStorage(storage);
  if (!target) return [];

  try {
    const raw = target.getItem(`${STORAGE_PREFIX}${userId}`);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === 'string')
      : [];
  } catch (error) {
    console.error('读取收藏列表失败', error);
    return [];
  }
};

/**
 * 切换收藏状态。成功返回切换后的状态，存储不可用时返回 null。
 */
export const toggleFavoritePost = (
  userId: string,
  postId: string,
  storage?: StorageLike,
): boolean | null => {
  if (!userId || !postId) return null;
  const target = resolveStorage(storage);
  if (!target) return null;

  try {
    const favoriteIds = getFavoritePostIds(userId, target);
    const isFavorite = favoriteIds.includes(postId);
    const nextIds = isFavorite
      ? favoriteIds.filter((id) => id !== postId)
      : [...favoriteIds, postId];
    target.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(nextIds));
    return !isFavorite;
  } catch (error) {
    console.error('保存收藏列表失败', error);
    return null;
  }
};
