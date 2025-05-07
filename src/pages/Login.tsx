
/**
 * 登录页面
 * 
 * 提供用户登录与注册的表单界面
 * 使用Tabs组件实现登录/注册表单的切换
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AnimatedTransition from '../components/AnimatedTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn, UserPlus } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('login');
  
  // 检查是否已登录，如已登录则跳转到首页
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate('/');
      }
    });
  }, [navigate]);
  
  // 注册成功后切换到登录页
  const handleRegisterSuccess = () => {
    setActiveTab('login');
  };
  
  return (
    <AnimatedTransition>
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">欢迎使用博客系统</h1>
            <p className="text-gray-600 dark:text-gray-300">登录或注册以继续</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="flex items-center gap-2">
                  <LogIn size={16} />
                  <span>登录</span>
                </TabsTrigger>
                <TabsTrigger value="register" className="flex items-center gap-2">
                  <UserPlus size={16} />
                  <span>注册</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              
              <TabsContent value="register">
                <RegisterForm onSuccess={handleRegisterSuccess} />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="text-center mt-6">
            <Link to="/" className="text-primary hover:underline">
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default Login;
