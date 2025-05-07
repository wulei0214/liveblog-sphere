
/**
 * 手机号输入组件
 * 用于短信验证码登录第一步：输入手机号并发送验证码
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sendPhoneOTP } from '@/utils/phoneAuth';

interface PhoneNumberInputProps {
  phone: string;
  setPhone: (phone: string) => void;
  setStep: (step: 'phone' | 'verify') => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  phone,
  setPhone,
  setStep,
  isLoading,
  setIsLoading,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  /**
   * 处理手机号输入变化
   * 只允许输入数字，过滤掉其他字符
   */
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 只保留数字
    const numericValue = value.replace(/[^\d]/g, '');
    setPhone(numericValue);
  };

  /**
   * 发送验证码
   */
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证手机号格式
    if (!phone || phone.length < 11) {
      toast({
        title: "无效的手机号码",
        description: "请输入有效的11位手机号码",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 发送验证码
      const { error } = await sendPhoneOTP(phone);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "验证码已发送",
        description: "请查看您的手机短信",
      });
      
      // 进入验证步骤
      setStep('verify');
    } catch (error) {
      toast({
        title: "发送验证码失败",
        description: error.message || "请稍后重试",
        variant: "destructive",
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
          placeholder="请输入手机号码"
          value={phone}
          onChange={handlePhoneChange}
          disabled={isLoading}
          className="w-full"
          maxLength={11}
          pattern="\d*"
          inputMode="numeric"
        />
        <p className="text-xs text-gray-500">
          请输入11位中国大陆手机号码
        </p>
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || phone.length !== 11}
      >
        {isLoading ? '发送中...' : '发送验证码'}
      </Button>
      
      <div className="text-center mt-4">
        <Button
          type="button"
          variant="link"
          onClick={() => navigate('/login')}
        >
          返回登录页
        </Button>
      </div>
    </form>
  );
};

export default PhoneNumberInput;
