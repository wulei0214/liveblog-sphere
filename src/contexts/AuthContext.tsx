
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, getCurrentUser, loginUser, logoutUser, registerUser, isAdmin } from '../lib/auth';
import { useToast } from '../hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdminUser: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // 检查用户是否已登录
  useEffect(() => {
    const loadUser = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };
    
    loadUser();
  }, []);
  
  // 登录方法
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const loggedInUser = loginUser(username, password);
      
      if (loggedInUser) {
        setUser(loggedInUser);
        toast({
          title: "登录成功",
          description: `欢迎回来，${loggedInUser.username}！`,
        });
        return true;
      } else {
        toast({
          title: "登录失败",
          description: "用户名或密码不正确",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "登录出错",
        description: "登录过程中发生错误",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // 注册方法
  const register = async (username: string, password: string): Promise<boolean> => {
    try {
      if (!username || !password) {
        toast({
          title: "注册失败",
          description: "用户名和密码不能为空",
          variant: "destructive",
        });
        return false;
      }
      
      const newUser = registerUser(username, password);
      
      if (newUser) {
        toast({
          title: "注册成功",
          description: "您可以现在登录了",
        });
        return true;
      } else {
        toast({
          title: "注册失败",
          description: "用户名已存在",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "注册出错",
        description: "注册过程中发生错误",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // 登出方法
  const logout = () => {
    logoutUser();
    setUser(null);
    toast({
      title: "已登出",
      description: "您已成功退出登录",
    });
  };
  
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdminUser: isAdmin(),
    login,
    logout,
    register,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
