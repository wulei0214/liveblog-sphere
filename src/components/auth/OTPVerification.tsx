import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/contexts/AuthContext';
import { verifyPhoneOTP } from '@/utils/phoneAuth';

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
  phone, otp, setOtp, setStep, isLoading, setIsLoading, handleSendOTP,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshUser } = useAuth();
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast({ title: '无效的验证码', description: '请输入6位数字验证码', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setIsAuthLoading(true);
    try {
      const { error } = await verifyPhoneOTP(phone, otp);
      if (error) throw error;
      await refreshUser();
      toast({ title: '登录成功', description: '已进入本地演示账号，可以体验发布和互动功能。' });
      navigate(import.meta.env.DEV ? '/' : '/profile-setup');
    } catch (error) {
      toast({
        title: '验证失败',
        description: error instanceof Error ? error.message : '验证码无效或已过期',
        variant: 'destructive',
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
          <InputOTP maxLength={6} value={otp} onChange={setOtp} disabled={isLoading || isAuthLoading}
            render={({ slots }) => <InputOTPGroup>{slots.map((slot, i) => <InputOTPSlot key={i} {...slot} />)}</InputOTPGroup>} />
        </div>
        <p className="text-xs text-center text-gray-500">本地演示验证码：<strong>123456</strong></p>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
        {isLoading ? '验证中...' : '验证并登录'}
      </Button>
      <div className="text-center mt-4 space-y-2">
        <Button type="button" variant="ghost" className="text-sm" disabled={isLoading} onClick={(e) => handleSendOTP(e)}>
          重新获取演示验证码
        </Button>
        <div><Button type="button" variant="link" onClick={() => setStep('phone')}>更改手机号码</Button></div>
      </div>
    </form>
  );
};

export default OTPVerification;
