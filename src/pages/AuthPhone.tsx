
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedTransition from '@/components/AnimatedTransition';
import PhoneNumberInput from '@/components/auth/PhoneNumberInput';
import OTPVerification from '@/components/auth/OTPVerification';
import { sendPhoneOTP } from '@/utils/phoneAuth';

const AuthPhone = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshUser } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  const [isLoading, setIsLoading] = useState(false);

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
    
    if (!phone || phone.length < 11) {
      toast({
        title: "无效的手机号码",
        description: "请输入有效的手机号码",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
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
              <PhoneNumberInput
                phone={phone}
                setPhone={setPhone}
                setStep={setStep}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            ) : (
              <OTPVerification
                phone={phone}
                otp={otp}
                setOtp={setOtp}
                setStep={setStep}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                handleSendOTP={handleSendOTP}
              />
            )}
          </div>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default AuthPhone;
