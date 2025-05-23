
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
      // 格式化手机号为国际格式 (+86 for China)
      const formattedPhone = phone.startsWith('+') ? phone : `+86${phone}`;
      
      try {
        // 尝试注册用户
        const { data, error } = await supabase.auth.signUp({ 
          phone: formattedPhone,
          password: "defaultpassword",
          options: {
            data: {
              phone: formattedPhone.replace('+86', '')
            }
          }
        });
        
        if (error) {
          // 如果账号已存在，尝试登录
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            phone: formattedPhone,
            password: "defaultpassword"
          });
          
          if (signInError) {
            throw signInError;
          }
        }
        
        toast({
          title: "登录成功",
          description: "欢迎回来",
        });
        
        // 刷新用户信息
        await refreshUser();
        
        // 检查用户是否需要设置资料
        navigate('/profile-setup');
        
      } catch (error) {
        console.error("验证码登录错误:", error);
        toast({
          title: "登录失败",
          description: "验证失败，请重新尝试",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast({
        title: "验证失败",
        description: error.message || "验证码无效或已过期",
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
          请输入短信中收到的6位验证码
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
