
/**
 * 手机验证相关工具函数
 * 提供手机号验证码发送、验证等功能
 */
import { supabase } from '@/integrations/supabase/client';
import type { AuthOtpResponse, AuthResponse } from '@supabase/supabase-js';

// 固定验证码常量 - 仅用于开发测试
const FIXED_OTP = "123456";

/**
 * 发送手机号码验证码
 * @param phone 手机号码
 * @returns 发送结果 (开发环境中始终成功)
 */
export const sendPhoneOTP = async (phone: string): Promise<AuthOtpResponse> => {
  // 验证手机号格式
  if (!isValidPhoneNumber(phone)) {
    throw new Error('请输入有效的11位手机号码');
  }

  // 模拟发送验证码 - 开发环境中不实际发送
  console.log(`开发环境：模拟发送验证码${FIXED_OTP}到手机号 ${phone}`);
  
  // 返回符合 AuthOtpResponse 类型的对象
  return {
    data: { 
      user: null,
      session: null,
      messageId: Date.now().toString() 
    },
    error: null,
  } as AuthOtpResponse;
};

/**
 * 验证手机验证码
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

  // 固定验证码检查 - 仅用于开发测试
  if (otp !== FIXED_OTP) {
    throw new Error('验证码错误，开发环境下请使用123456');
  }

  // 格式化手机号为国际格式 (+86 for China)
  const formattedPhone = phone.startsWith('+') ? phone : `+86${phone}`;
  
  try {
    // 开发环境: 直接尝试使用手机号作为密码进行普通登录
    const result = await supabase.auth.signInWithPassword({
      phone: formattedPhone,
      password: "defaultpassword"
    });

    // 如果用户不存在，则创建新用户
    if (result.error && result.error.message.includes("Invalid login credentials")) {
      const signUpResult = await supabase.auth.signUp({
        phone: formattedPhone,
        password: "defaultpassword",
        options: {
          data: {
            phone: formattedPhone.replace('+86', '')
          }
        }
      });
      
      return signUpResult as AuthResponse;
    }
    
    return result as AuthResponse;
  } catch (error) {
    console.error('验证OTP错误:', error);
    throw error;
  }
};

// 保持其他工具函数不变
export const formatPhoneNumber = (phone: string): string => {
  return phone.startsWith('+') ? phone : `+86${phone}`;
};

export const isValidPhoneNumber = (phone: string): boolean => {
  // 提取数字部分
  const numericPhone = phone.replace(/\D/g, '');
  
  // 检查是否为11位中国手机号
  if (phone.startsWith('+86')) {
    return /^\+86\d{11}$/.test(phone);
  }
  
  return /^1\d{10}$/.test(numericPhone);
};

export const filterPhoneInput = (input: string): string => {
  return input.replace(/\D/g, '');
};
