import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { filterPhoneInput, isValidPhoneNumber, sendPhoneOTP } from '@/utils/phoneAuth';

interface PhoneNumberInputProps {
  phone: string;
  setPhone: (phone: string) => void;
  setStep: (step: 'phone' | 'verify') => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({ phone, setPhone, setStep, isLoading, setIsLoading }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => setPhone(filterPhoneInput(e.target.value));

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPhoneNumber(phone)) {
      toast({ title: '无效的手机号码', description: '请输入有效的11位中国大陆手机号码', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      await sendPhoneOTP(phone);
      toast({ title: '演示验证码已准备好', description: '本地开发模式固定使用 123456，不会发送真实短信。' });
      setStep('verify');
    } catch (error) {
      toast({
        title: '获取验证码失败',
        description: error instanceof Error ? error.message : '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSendOTP} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">手机号码</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="请输入11位中国大陆手机号码"
          value={phone}
          onChange={handlePhoneChange}
          disabled={isLoading}
          className="w-full"
          maxLength={11}
          pattern="\d*"
          inputMode="numeric"
        />
        <p className="text-xs text-gray-500">本地演示模式：不会发送短信，验证码固定为 <strong>123456</strong>。</p>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading || phone.length !== 11}>
        {isLoading ? '处理中...' : '获取演示验证码'}
      </Button>
      <div className="text-center mt-4">
        <Button type="button" variant="ghost" size="sm" onClick={() => navigate('/login')}>返回登录页</Button>
      </div>
    </form>
  );
};

export default PhoneNumberInput;
