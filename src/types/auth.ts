
import { User } from '@supabase/supabase-js';
import { User as LocalUser, UserRole } from '@/lib/auth';

// 身份验证上下文类型定义
export interface AuthContextType {
  user: LocalUser | null;
  supabaseUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdminUser: boolean;
  isEditorUser: boolean;
  logout: () => Promise<void>;
  refreshUser: () => void;
}
