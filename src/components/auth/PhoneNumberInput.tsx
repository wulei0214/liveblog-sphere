
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
import { filterPhoneInput, isValidPhoneNumber } from '@/utils/phoneAuth';

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
    const numericValue = filterPhoneInput(value);
    setPhone(numericValue);
  };

  /**
   * 发送验证码
   * 开发环境下不实际发送，使用固定验证码"123456"
   */
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证手机号格式
    if (!isValidPhoneNumber(phone)) {
      toast({
        title: "无效的手机号码",
        description: "请输入有效的11位手机号码",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 开发环境提示
      toast({
        title: "验证码已发送",
        description: "开发环境固定验证码: 123456",
      });
      
      // 进入验证步骤
      setStep('verify');
    } catch (error) {
      console.error('Send OTP error:', error);
      toast({
        title: "发送验证码失败",
        description: "请稍后重试",
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
          <br />
          <span className="text-amber-600 font-semibold">开发环境下将使用 123456 作为固定验证码</span>
        </p>
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || phone.length !== 11}
      >
        {isLoading ? '发送中...' : '获取验证码'}
      </Button>
      
      <div className="text-center mt-4">
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate('/login')}
          >
            返回登录页
          </Button>
        </div>
      </div>
    </form>
  );
};

export default PhoneNumberInput;
