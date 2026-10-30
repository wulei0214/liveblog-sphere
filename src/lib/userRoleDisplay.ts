import { UserRole } from '@/repositories/user/types';

// 角色显示文案属于纯业务逻辑，独立于 React 组件，便于复用和热更新。
export const getUserRoleDisplay = (role: string | UserRole | undefined): string => {
  if (role === UserRole.ADMIN || role === 'admin') return '管理员';
  if (role === UserRole.EDITOR || role === 'editor') return '编辑';
  return '用户';
};
