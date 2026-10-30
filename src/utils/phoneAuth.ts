/**
 * 本地演示手机号验证码工具。
 * Vite 开发模式只使用本地会话，不向旧 Supabase 项目发送请求。
 */
import { supabase } from '@/integrations/supabase/client';
import type { AuthOtpResponse, AuthResponse } from '@supabase/supabase-js';
import { phoneAuthLogin } from '@/repositories/user/authLogin';

const FIXED_OTP = '123456';

export const sendPhoneOTP = async (phone: string): Promise<AuthOtpResponse> => {
  if (!isValidPhoneNumber(phone)) throw new Error('请输入有效的11位中国大陆手机号码');
  if (import.meta.env.DEV) {
    console.info('本地演示模式：验证码固定为 123456，不会发送短信。');
    return {
      data: { user: null, session: null, messageId: 'local-' + Date.now() },
      error: null,
    } as AuthOtpResponse;
  }
  return supabase.auth.signInWithOtp({ phone: formatPhoneNumber(phone) });
};

export const verifyPhoneOTP = async (phone: string, otp: string): Promise<AuthResponse> => {
  if (!isValidPhoneNumber(phone)) throw new Error('请输入有效的11位中国大陆手机号码');
  if (!/^\d{6}$/.test(otp || '')) throw new Error('请输入有效的6位数字验证码');
  if (otp !== FIXED_OTP) throw new Error('验证码错误，本地演示模式请使用 123456');

  if (import.meta.env.DEV) {
    phoneAuthLogin(phone);
    return { data: { user: null, session: null }, error: null } as AuthResponse;
  }
  throw new Error('正式环境尚未配置短信验证码验证，请联系管理员');
};

export const formatPhoneNumber = (phone: string): string => phone.startsWith('+') ? phone : '+86' + phone;

export const isValidPhoneNumber = (phone: string): boolean => {
  if (phone.startsWith('+86')) return /^\+86\d{11}$/.test(phone);
  return /^1\d{10}$/.test(phone.replace(/\D/g, ''));
};

export const filterPhoneInput = (input: string): string => input.replace(/\D/g, '');
