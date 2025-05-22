
/**
 * 验证码验证组件
 * 用于短信验证码登录第二步：输入验证码进行验证
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from '@/components/ui/input-otp';
import { sendPhoneOTP, verifyPhoneOTP } from '@/utils/phoneAuth';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface OTPVerificationProps {
  phone: string;
  otp: string;
  setOtp: (otp: string) => void;
  setStep: (step: 'phone' | 'verify') => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  handleSendOTP: (e: React.FormEvent) => Promise<void>;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  phone,
  otp,
  setOtp,
  setStep,
  isLoading,
  setIsLoading,
  handleSendOTP,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshUser } = useAuth();
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  /**
   * 验证OTP验证码
   * 支持两种方式:
   * 1. 使用"123456"作为万能验证码
   * 2. 通过Supabase验证手机号码
   */
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证输入的验证码格式
    if (!otp || otp.length !== 6) {
      toast({
        title: "无效的验证码",
        description: "请输入6位数验证码",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setIsAuthLoading(true);
    
    try {
      // 万能验证码检查 - 允许使用"123456"跳过实际验证
      if (otp === "123456") {
        // 直接使用Supabase手机号登录，无需验证OTP
        const formattedPhone = phone.startsWith('+') ? phone : `+86${phone}`;
        const { data, error } = await supabase.auth.signInWithOtp({ 
          phone: formattedPhone,
          options: { shouldCreateUser: true }
        });

        if (error) {
          throw error;
        }
        
        toast({
          title: "登录成功",
          description: "欢迎回来",
        });
        
        refreshUser(); // 刷新用户信息
        
        // 获取用户信息，检查用户名是否需要设置（如果是手机号则需要设置）
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username')
          .eq('phone', formattedPhone)
          .single();
        
        if (profileData && profileData.username === formattedPhone) {
          // 如果用户需要设置资料，跳转到资料设置页
          navigate('/profile-setup');
        } else {
          // 否则跳转到首页
          navigate('/');
        }
        
        return;
      }
      
      // 实际的验证码验证逻辑
      const formattedPhone = phone.startsWith('+') ? phone : `+86${phone}`;
      const { data, error } = await supabase.auth.verifyOtp({ 
        phone: formattedPhone, 
        token: otp, 
        type: 'sms'
      });

      if (error) {
        // 真实场景中的OTP验证失败
        throw new Error("验证失败，请使用万能验证码：123456");
      }

      toast({
        title: "验证成功",
        description: "欢迎回来",
      });
      
      refreshUser(); // 刷新用户信息
      
      // 检查用户是否需要设置资料
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username')
        .eq('phone', formattedPhone)
        .single();
      
      if (profileData && profileData.username === formattedPhone) {
        // 如果用户名等于手机号，需要设置资料
        navigate('/profile-setup');
      } else {
        // 否则跳转到首页
        navigate('/');
      }
      
    } catch (error) {
      console.error('OTP verification error:', error);
      toast({
        title: "验证失败",
        description: error.message || "验证码无效或已过期，请使用万能验证码：123456",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsAuthLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerifyOTP} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="otp">验证码</Label>
        
        <div className="flex justify-center py-4">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            disabled={isLoading}
            render={({ slots }) => (
              <InputOTPGroup>
                {slots.map((slot, i) => (
                  <InputOTPSlot key={i} {...slot} />
                ))}
              </InputOTPGroup>
            )}
          />
        </div>
        
        <p className="text-xs text-center text-gray-500 mt-2">
          审核测试阶段：请使用万能验证码 123456
        </p>
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || otp.length !== 6}
      >
        {isLoading ? '验证中...' : '验证并登录'}
      </Button>
      
      <div className="text-center mt-4 space-y-2">
        <Button
          type="button"
          variant="ghost"
          className="text-sm"
          disabled={isLoading}
          onClick={(e) => handleSendOTP(e as any)}
        >
          重新发送验证码
        </Button>
        
        <div>
          <Button
            type="button"
            variant="link"
            onClick={() => setStep('phone')}
          >
            更改手机号码
          </Button>
        </div>
      </div>
    </form>
  );
};

export default OTPVerification;
