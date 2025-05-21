
/**
 * 验证码验证组件
 * 用于短信验证码登录第二步：输入验证码进行验证
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from '@/components/ui/input-otp';
import { sendPhoneOTP } from '@/utils/phoneAuth';
import { useAuth } from '@/contexts/AuthContext';
import { phoneAuthLogin, needsNicknameSetup } from '@/repositories/user/auth';

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

  /**
   * 验证OTP验证码
   * 注意：当前实现允许使用"123456"作为万能验证码
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
    
    try {
      // 万能验证码检查 - 允许使用"123456"跳过实际验证
      if (otp === "123456") {
        // 直接使用手机号登录或注册，跳过API验证
        const user = phoneAuthLogin(phone);
        
        toast({
          title: "登录成功",
          description: "欢迎回来",
        });
        
        refreshUser(); // 刷新用户信息
        
        // 检查用户是否需要设置资料
        if (needsNicknameSetup(user)) {
          // 如果用户需要设置资料，跳转到资料设置页
          navigate('/profile-setup');
        } else {
          // 否则跳转到首页
          navigate('/');
        }
        
        return;
      }
      
      // 实际的验证码验证逻辑
      // 注意：由于Supabase手机验证暂时不可用，这部分代码实际上不会执行
      // 但保留以备将来启用
      toast({
        title: "验证失败",
        description: "请使用万能验证码：123456",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "验证失败",
        description: error.message || "验证码无效或已过期",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
