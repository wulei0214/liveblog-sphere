
/**
 * 身份验证上下文
 * 管理用户登录状态和身份验证相关功能
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, getCurrentUser, loginUser, logoutUser, registerUser, isAdmin, isEditor } from '../lib/data';
import { useToast } from '../hooks/use-toast';

/**
 * 身份验证上下文类型定义
 */
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdminUser: boolean;
  isEditorUser: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string, email?: string, phone?: string) => Promise<boolean>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 身份验证提供者组件
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  /**
   * 加载当前用户信息
   */
  const loadUser = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  };
  
  // 组件挂载时加载用户信息
  useEffect(() => {
    loadUser();
  }, []);
  
  /**
   * 刷新用户信息
   * 用于用户信息更新后重新获取最新数据
   */
  const refreshUser = () => {
    loadUser();
  };
  
  /**
   * 登录函数
   * @param username 用户名
   * @param password 密码
   * @returns 登录是否成功
   */
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // 确保去除用户名和密码前后的空格
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
      
      if (!trimmedUsername || !trimmedPassword) {
        toast({
          title: "登录失败",
          description: "用户名和密码不能为空",
          variant: "destructive",
          duration: 3000,
        });
        return false;
      }
      
      const loggedInUser = loginUser(trimmedUsername, trimmedPassword);
      
      if (loggedInUser) {
        setUser(loggedInUser);
        toast({
          title: "登录成功",
          description: `欢迎回来，${loggedInUser.username}！`,
          duration: 3000,
        });
        return true;
      } else {
        toast({
          title: "登录失败",
          description: "用户名或密码不正确",
          variant: "destructive",
          duration: 3000,
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "登录出错",
        description: "登录过程中发生错误",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
  };
  
  /**
   * 注册函数
   * @param username 用户名
   * @param password 密码
   * @param email 电子邮件
   * @param phone 手机号码
   * @returns 注册是否成功
   */
  const register = async (
    username: string, 
    password: string,
    email?: string,
    phone?: string
  ): Promise<boolean> => {
    try {
      // 确保去除输入值前后的空格
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
      const trimmedEmail = email?.trim();
      const trimmedPhone = phone?.trim();
      
      if (!trimmedUsername || !trimmedPassword) {
        toast({
          title: "注册失败",
          description: "用户名和密码不能为空",
          variant: "destructive",
          duration: 3000,
        });
        return false;
      }
      
      const newUser = registerUser(trimmedUsername, trimmedPassword, trimmedEmail, trimmedPhone);
      
      if (newUser) {
        toast({
          title: "注册成功",
          description: "您可以现在登录了",
          duration: 3000,
        });
        return true;
      } else {
        toast({
          title: "注册失败",
          description: "用户名已存在或信息有误",
          variant: "destructive",
          duration: 3000,
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "注册出错",
        description: "注册过程中发生错误",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
  };
  
  /**
   * 退出登录函数
   */
  const logout = () => {
    logoutUser();
    setUser(null);
    toast({
      title: "已登出",
      description: "您已成功退出登录",
      duration: 3000,
    });
  };
  
  // 上下文提供的值
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdminUser: isAdmin(),
    isEditorUser: isEditor(),
    login,
    logout,
    register,
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
