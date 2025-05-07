
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
import { sendPhoneOTP, verifyPhoneOTP } from '@/utils/phoneAuth';

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

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      const { error } = await verifyPhoneOTP(phone, otp);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "登录成功",
        description: "欢迎回来",
      });
      
      // 登录成功后导航到首页
      navigate('/');
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
                  <InputOTPSlot key={i} index={i} {...slot} />
                ))}
              </InputOTPGroup>
            )}
          />
        </div>
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
