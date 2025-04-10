
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';

const AuthPhone = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState(null);

  // 检查是否已登录
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate('/');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // 发送手机验证码
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || phone.length < 10) {
      toast({
        title: "无效的手机号码",
        description: "请输入有效的手机号码",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 格式化手机号码为国际格式 (+86 for China)
      const formattedPhone = phone.startsWith('+') ? phone : `+86${phone}`;
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });
      
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

  // 验证OTP
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
      // 格式化手机号码为国际格式 (+86 for China)
      const formattedPhone = phone.startsWith('+') ? phone : `+86${phone}`;
      
      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms',
      });
      
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
    <AnimatedTransition>
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">手机号码登录</h1>
            <p className="text-gray-600 dark:text-gray-300">
              {step === 'phone' ? '输入手机号码获取验证码' : '输入收到的验证码'}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            {step === 'phone' ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">手机号码</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="请输入手机号码"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isLoading}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    中国大陆手机号无需输入国家代码，其他地区需添加国际区号（如：+1）
                  </p>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
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
            ) : (
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
                          {slots.map((slot, index) => (
                            <InputOTPSlot key={index} {...slot} />
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
                    onClick={() => handleSendOTP(new Event('click') as any)}
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
            )}
          </div>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default AuthPhone;
