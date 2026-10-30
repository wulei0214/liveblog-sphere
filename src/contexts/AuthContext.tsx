import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AuthContextType, AppUser } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { getCurrentUser, logoutUser } from '@/repositories/user/authSession';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<AppUser | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Local Vite development must never contact the old Supabase project.
    if (import.meta.env.DEV) {
      const syncLocalUser = () => {
        const localUser = getCurrentUser();
        setUser(localUser ? { ...localUser } : null);
        setSupabaseUser(null);
        setSession(null);
        setIsLoading(false);
      };
      syncLocalUser();
      window.addEventListener('local-auth-change', syncLocalUser);
      window.addEventListener('storage', syncLocalUser);
      return () => {
        window.removeEventListener('local-auth-change', syncLocalUser);
        window.removeEventListener('storage', syncLocalUser);
      };
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      setSupabaseUser(nextSession?.user || null);
      if (nextSession?.user) {
        try {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', nextSession.user.id).single();
          setUser(profile ? { ...profile, id: nextSession.user.id } : null);
        } catch (error) {
          console.error('获取用户资料失败', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    const fetchInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setSupabaseUser(initialSession?.user || null);
        if (initialSession?.user) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', initialSession.user.id).single();
          setUser(profile ? { ...profile, id: initialSession.user.id } : null);
        }
      } catch (error) {
        console.error('获取会话失败', error);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchInitialSession();
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (import.meta.env.DEV) {
      logoutUser();
      setUser(null);
      setSupabaseUser(null);
      setSession(null);
      return;
    }
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSupabaseUser(null);
      setSession(null);
    } catch (error) {
      toast({
        title: '退出失败',
        description: error instanceof Error ? error.message : '请稍后重试',
        variant: 'destructive',
      });
    }
  };

  const refreshUser = async () => {
    if (import.meta.env.DEV) {
      const localUser = getCurrentUser();
      setUser(localUser ? { ...localUser } : null);
      return;
    }
    if (!supabaseUser) return;
    try {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', supabaseUser.id).single();
      if (profile) setUser({ ...profile, id: supabaseUser.id });
    } catch (error) {
      console.error('刷新用户信息失败', error);
    }
  };

  const value: AuthContextType = {
    user,
    supabaseUser,
    isLoading,
    isAuthenticated: !!user,
    isAdminUser: user?.role === 'admin',
    logout: handleLogout,
    refreshUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
