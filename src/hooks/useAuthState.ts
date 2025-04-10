
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExtendedUser } from '@/types/auth';
import { fetchUserProfile } from '@/services/authService';
import { User } from '@supabase/supabase-js';

/**
 * 管理认证状态的自定义钩子
 */
export function useAuthState() {
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const handleProfileFetch = async (userId: string) => {
    try {
      const userData = await fetchUserProfile(userId);
      if (userData) {
        setUser(userData);
      }
    } catch (err) {
      console.error('获取用户资料时出错:', err);
    }
  };
  
  // 刷新用户信息
  const refreshUser = () => {
    if (supabaseUser?.id) {
      handleProfileFetch(supabaseUser.id);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    
    // 设置认证状态监听器
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSupabaseUser(session?.user || null);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          // 使用 setTimeout 防止递归调用
          setTimeout(() => handleProfileFetch(session.user.id), 0);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    // 获取当前会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseUser(session?.user || null);
      
      if (session?.user) {
        handleProfileFetch(session.user.id);
      }
      setIsLoading(false);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    setUser,
    supabaseUser,
    isLoading,
    refreshUser
  };
}
