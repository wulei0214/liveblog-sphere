
import { User as SupabaseUser } from '@supabase/supabase-js';

// 定义应用用户类型
export interface AppUser {
  id: string;
  username: string;
  phone?: string;
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
  logout: () => Promise<void>;
  refreshUser: () => void;
}
