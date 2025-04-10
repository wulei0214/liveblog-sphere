
import { supabase } from '@/integrations/supabase/client';
import { ExtendedUser, UserRole } from '@/types/auth';
import { User } from '@supabase/supabase-js';

/**
 * 获取用户个人资料
 * @param userId 用户ID
 * @returns 扩展的用户信息
 */
export async function fetchUserProfile(userId: string): Promise<ExtendedUser | null> {
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
      return {
        id: userId,
        username: data.username || userData?.user?.email?.split('@')[0] || '用户',
        role: role,
        email: userData?.user?.email,
        phone: data.phone || userData?.user?.phone,
        avatar: data.avatar,
        bio: data.bio,
        following: data.following,
        followers: data.followers
      };
    }
    
    return null;
  } catch (error) {
    console.error('获取用户资料失败:', error);
    return null;
  }
}

/**
 * 退出登录
 */
export async function logoutUser(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * 检查是否是管理员用户
 */
export function isAdminUser(user: ExtendedUser | null): boolean {
  return user?.role === UserRole.ADMIN;
}

/**
 * 检查是否是编辑或管理员用户
 */
export function isEditorUser(user: ExtendedUser | null): boolean {
  return user?.role === UserRole.EDITOR || user?.role === UserRole.ADMIN;
}
