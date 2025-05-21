
/**
 * 登录页面
 * 
 * 在新认证流程中主要作为过渡页面
 * 引导用户使用手机登录或管理员登录
 */
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedTransition from '../components/AnimatedTransition';
import { Button } from '@/components/ui/button';
import { Phone, Shield } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // 检查是否已登录，如已登录则跳转到首页
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  return (
    <AnimatedTransition>
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">欢迎使用博客系统</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">请选择登录方式继续</p>
            
            <div className="space-y-4">
              <Link to="/auth-phone" className="block">
                <Button
                  variant="default"
                  size="lg"
                  className="w-full flex items-center justify-center gap-2 py-6"
                >
                  <Phone className="h-5 w-5" />
                  <span>手机号登录/注册</span>
                </Button>
              </Link>
              
              <Link to="/admin-login" className="block">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full flex items-center justify-center gap-2 py-6 border-dashed"
                >
                  <Shield className="h-5 w-5" />
                  <span>管理员登录</span>
                </Button>
              </Link>
            </div>
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
