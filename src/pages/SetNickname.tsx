
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedTransition from '@/components/AnimatedTransition';
import NicknameForm from '@/components/auth/NicknameForm';
import { useAuth } from '@/contexts/AuthContext';

const SetNickname = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // 如果用户未登录，重定向到登录页
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // 如果用户名不是手机号，说明已经设置过昵称，直接去首页
  useEffect(() => {
    if (user && !user.username.match(/^1\d{10}$/)) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <AnimatedTransition>
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">欢迎加入</h1>
            <p className="text-gray-600 dark:text-gray-300">请设置您的昵称以完成注册</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <NicknameForm />
          </div>
          
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default SetNickname;
