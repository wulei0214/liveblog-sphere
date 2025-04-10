
import { User } from '@supabase/supabase-js';

// 用户角色枚举
export enum UserRole {
  USER = 'user',
  EDITOR = 'editor',
  ADMIN = 'admin'
}

// 扩展用户类型，包含额外信息
export interface ExtendedUser {
  id: string;
  username: string;
  role: UserRole;
  email?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  following?: string[];
  followers?: string[];
}

/**
 * 身份验证上下文类型定义
 */
export interface AuthContextType {
  user: ExtendedUser | null;
  supabaseUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdminUser: boolean;
  isEditorUser: boolean;
  logout: () => Promise<void>;
  refreshUser: () => void;
}
