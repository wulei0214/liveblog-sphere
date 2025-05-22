
/**
 * 创建管理员用户
 * 
 * 此文件仅供开发使用，用于在开发环境中创建管理员用户
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * 创建管理员用户
 * 
 * @param email 管理员邮箱
 * @param password 管理员密码
 * @returns 创建结果
 */
export const createAdminUser = async (
  email: string = 'admin@example.com', 
  password: string = 'admin123'
): Promise<boolean> => {
  try {
    // 创建用户
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: 'admin'
        }
      }
    });
    
    if (error) {
      console.error('创建管理员用户失败:', error);
      return false;
    }
    
    // 检查是否已存在profilesbuta
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', data.user?.id)
      .single();
      
    // 如果没有对应的profile，手动创建一个
    if (profileError && !profileData && data.user) {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          username: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      if (insertError) {
        console.error('创建管理员资料失败:', insertError);
        return false;
      }
    }
    
    console.log('管理员用户创建成功:', data.user);
    return true;
  } catch (error) {
    console.error('创建管理员用户异常:', error);
    return false;
  }
};

/**
 * 在开发环境中执行此函数可创建管理员用户
 * 例如:
 * 
 * import { createAdminUser } from './createAdminUser';
 * createAdminUser('admin@example.com', 'secure_password');
 */
