
/**
 * 身份验证上下文
 * 管理用户登录状态和身份验证相关功能
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '../hooks/use-toast';
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
interface AuthContextType {
  user: ExtendedUser | null;
  supabaseUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdminUser: boolean;
  isEditorUser: boolean;
  logout: () => Promise<void>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 身份验证提供者组件
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // 获取用户个人资料
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar, bio, phone, following, followers')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      // 获取用户元数据
      const { data: userData } = await supabase.auth.getUser();
      const role = userData?.user?.user_metadata?.role as UserRole || UserRole.USER;
      
      if (data) {
        setUser({
          id: userId,
          username: data.username || userData?.user?.email?.split('@')[0] || '用户',
          role: role,
          email: userData?.user?.email,
          phone: data.phone || userData?.user?.phone,
          avatar: data.avatar,
          bio: data.bio,
          following: data.following,
          followers: data.followers
        });
      }
    } catch (error) {
      console.error('获取用户资料失败:', error);
    }
  };
  
  // 初始化: 检查会话并设置监听
  useEffect(() => {
    setIsLoading(true);
    
    // 设置认证状态监听器
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSupabaseUser(session?.user || null);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          // 使用 setTimeout 防止递归调用
          setTimeout(() => fetchUserProfile(session.user.id), 0);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    // 获取当前会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseUser(session?.user || null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setIsLoading(false);
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  /**
   * 刷新用户信息
   * 用于用户信息更新后重新获取最新数据
   */
  const refreshUser = () => {
    if (supabaseUser?.id) {
      fetchUserProfile(supabaseUser.id);
    }
  };
  
  /**
   * 退出登录函数
   */
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      toast({
        title: "已登出",
        description: "您已成功退出登录",
      });
    } catch (error) {
      toast({
        title: "退出失败",
        description: error.message || "请稍后重试",
        variant: "destructive",
      });
    }
  };
  
  // 检查用户角色
  const isAdmin = (): boolean => {
    return user?.role === UserRole.ADMIN;
  };
  
  const isEditor = (): boolean => {
    return user?.role === UserRole.EDITOR || user?.role === UserRole.ADMIN;
  };
  
  // 上下文提供的值
  const value = {
    user,
    supabaseUser,
    isLoading,
    isAuthenticated: !!user,
    isAdminUser: isAdmin(),
    isEditorUser: isEditor(),
    logout,
    refreshUser,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * 使用身份验证上下文的钩子
 * @returns 身份验证上下文
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
