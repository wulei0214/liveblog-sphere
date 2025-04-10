
/**
 * 身份验证上下文
 * 管理用户登录状态和身份验证相关功能
 */
import React, { createContext, useContext, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AuthContextType } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { isAdminUser, isEditorUser, logoutUser } from '@/services/authService';

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 身份验证提供者组件
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { 
    user, 
    supabaseUser, 
    isLoading, 
    refreshUser,
    setUser 
  } = useAuthState();
  
  /**
   * 退出登录函数
   */
  const logout = async () => {
    try {
      await logoutUser();
      
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
  
  // 上下文提供的值
  const value: AuthContextType = {
    user,
    supabaseUser,
    isLoading,
    isAuthenticated: !!user,
    isAdminUser: isAdminUser(user),
    isEditorUser: isEditorUser(user),
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
