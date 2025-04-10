
/**
 * 身份验证上下文
 * 管理用户登录状态和身份验证相关功能
 */
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AuthContextType } from '@/types/auth';
import { getCurrentUser, logoutUser as logout, UserRole } from '@/lib/auth';
import type { User } from '@/lib/auth';

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 身份验证提供者组件
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 初始化时从会话存储获取当前用户
  useEffect(() => {
    try {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('获取当前用户失败', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * 退出登录函数
   */
  const handleLogout = async () => {
    try {
      logout();
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
  
  /**
   * 刷新用户信息
   */
  const refreshUser = () => {
    try {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('刷新用户信息失败', error);
    }
  };
  
  // 上下文提供的值
  const value: AuthContextType = {
    user,
    supabaseUser: null, // 不使用supabase
    isLoading,
    isAuthenticated: !!user,
    isAdminUser: user?.role === UserRole.ADMIN,
    isEditorUser: user?.role === UserRole.ADMIN || user?.role === UserRole.EDITOR,
    logout: handleLogout,
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
