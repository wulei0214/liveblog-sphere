
/**
 * 身份验证上下文
 * 管理用户登录状态和身份验证相关功能
 */
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AuthContextType } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 身份验证提供者组件
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<any | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 初始化时监听Supabase身份验证状态变化
  useEffect(() => {
    // 设置状态监听器
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setSupabaseUser(session?.user || null);
        
        if (session?.user) {
          // 当用户登录时，获取其个人资料
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profile) {
              // 使用资料信息设置用户
              setUser({
                ...profile,
                role: profile.username === 'admin' ? 'admin' : 'user',
              });
            }
          } catch (error) {
            console.error('获取用户资料失败', error);
          }
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );
    
    // 初始加载时获取当前会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSupabaseUser(session?.user || null);
      
      if (session?.user) {
        // 获取用户资料
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setUser({
                ...profile,
                role: profile.username === 'admin' ? 'admin' : 'user',
              });
            }
            setIsLoading(false);
          })
          .catch((error) => {
            console.error('获取用户资料失败', error);
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    });
    
    // 清理订阅
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  /**
   * 退出登录函数
   */
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      setSupabaseUser(null);
      setSession(null);
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
  const refreshUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // 刷新用户资料
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUser({
            ...profile,
            role: profile.username === 'admin' ? 'admin' : 'user',
          });
        }
      }
    } catch (error) {
      console.error('刷新用户信息失败', error);
    }
  };
  
  // 上下文提供的值
  const value: AuthContextType = {
    user,
    supabaseUser,
    isLoading,
    isAuthenticated: !!user,
    isAdminUser: user?.role === 'admin',
    isEditorUser: user?.role === 'admin' || user?.role === 'editor',
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
