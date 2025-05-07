
/**
 * 手机验证相关工具函数
 * 提供手机号验证码发送、验证等功能
 */
import { supabase } from '@/integrations/supabase/client';
import type { AuthOtpResponse, AuthResponse } from '@supabase/supabase-js';

/**
 * 发送手机号码验证码
 * @param phone 手机号码
 * @returns 发送结果
 */
export const sendPhoneOTP = async (phone: string): Promise<AuthOtpResponse> => {
  // 格式化手机号码为国际格式 (+86 for China)
  const formattedPhone = phone.startsWith('+') ? phone : `+86${phone}`;
  
  return await supabase.auth.signInWithOtp({
    phone: formattedPhone,
  });
};

/**
 * 验证手机验证码
 * @param phone 手机号码
 * @param otp 验证码
 * @returns 验证结果
 */
export const verifyPhoneOTP = async (phone: string, otp: string): Promise<AuthResponse> => {
  // 格式化手机号码为国际格式 (+86 for China)
  const formattedPhone = phone.startsWith('+') ? phone : `+86${phone}`;
  
  return await supabase.auth.verifyOtp({
    phone: formattedPhone,
    token: otp,
    type: 'sms',
  });
};

/**
 * 格式化手机号码
 * @param phone 手机号码
 * @returns 格式化后的手机号码
 */
export const formatPhoneNumber = (phone: string): string => {
  return phone.startsWith('+') ? phone : `+86${phone}`;
};
