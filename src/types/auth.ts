
import { User as SupabaseUser } from '@supabase/supabase-js';

// 用户角色枚举
export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
}

// 定义应用用户类型
export interface AppUser {
  id: string;
  username: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  createdAt?: Date;
  birthDate?: Date;
  following?: string[];
  followers?: string[];
}

// 身份验证上下文类型定义
export interface AuthContextType {
  user: AppUser | null;
  supabaseUser: SupabaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdminUser: boolean;
  isEditorUser: boolean;
  logout: () => Promise<void>;
  refreshUser: () => void;
}
