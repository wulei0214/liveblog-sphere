
/**
 * 手机验证相关工具函数
 * 提供手机号验证码发送、验证等功能
 */
import { supabase } from '@/integrations/supabase/client';
import type { AuthOtpResponse, AuthResponse } from '@supabase/supabase-js';

/**
 * 发送手机号码验证码
 * 审核阶段：仅模拟发送，不实际调用API
 * @param phone 手机号码
 * @returns 发送结果
 */
export const sendPhoneOTP = async (phone: string): Promise<AuthOtpResponse> => {
  // 验证手机号格式
  if (!isValidPhoneNumber(phone)) {
    throw new Error('请输入有效的11位手机号码');
  }

  // 审核阶段 - 返回模拟成功响应
  // 不实际发送验证码，统一使用123456作为万能验证码
  return {
    data: { 
      user: null,
      session: null,
      messageId: "mock-verification-id"
    },
    error: null
  } as AuthOtpResponse;
  
  // 以下是实际调用Supabase的代码，审核阶段暂不使用
  // 格式化手机号码为国际格式 (+86 for China)
  // const formattedPhone = phone.startsWith('+') ? phone : `+86${phone}`;
  // return await supabase.auth.signInWithOtp({
  //   phone: formattedPhone,
  // });
};

/**
 * 验证手机验证码
 * 审核阶段：仅验证是否为万能验证码(123456)
 * @param phone 手机号码
 * @param otp 验证码
 * @returns 验证结果
 */
export const verifyPhoneOTP = async (phone: string, otp: string): Promise<AuthResponse> => {
  // 验证手机号格式
  if (!isValidPhoneNumber(phone)) {
    throw new Error('请输入有效的11位手机号码');
  }

  // 验证验证码格式
  if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
    throw new Error('请输入有效的6位数字验证码');
  }
  
  // 审核阶段 - 检查是否为万能验证码
  if (otp !== '123456') {
    throw new Error('验证码错误，审核阶段请使用：123456');
  }
  
  // 返回模拟成功响应
  return {
    data: { 
      session: null, 
      user: null 
    },
    error: null
  } as AuthResponse;
  
  // 以下是实际调用Supabase的代码，审核阶段暂不使用
  // 格式化手机号码为国际格式 (+86 for China)
  // const formattedPhone = phone.startsWith('+') ? phone : `+86${phone}`;
  // return await supabase.auth.verifyOtp({
  //   phone: formattedPhone,
  //   token: otp,
  //   type: 'sms',
  // });
};

/**
 * 格式化手机号码
 * @param phone 手机号码
 * @returns 格式化后的手机号码
 */
export const formatPhoneNumber = (phone: string): string => {
  return phone.startsWith('+') ? phone : `+86${phone}`;
};

/**
 * 验证手机号格式
 * @param phone 手机号码
 * @returns 是否为有效的手机号
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  // 提取数字部分
  const numericPhone = phone.replace(/\D/g, '');
  
  // 检查是否为11位中国手机号
  if (phone.startsWith('+86')) {
    return /^\+86\d{11}$/.test(phone);
  }
  
  return /^1\d{10}$/.test(numericPhone);
};

/**
 * 过滤手机号输入，只保留数字
 * @param input 输入值
 * @returns 过滤后只包含数字的字符串
 */
export const filterPhoneInput = (input: string): string => {
  return input.replace(/\D/g, '');
};
