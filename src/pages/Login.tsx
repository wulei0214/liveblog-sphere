import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedTransition from '../components/AnimatedTransition';
import { Button } from '@/components/ui/button';
import { Phone, Shield } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  return (
    <AnimatedTransition>
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">欢迎使用博客系统</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">选择本地演示身份，体验不同角色的功能</p>
            <div className="space-y-4">
              <Link to="/auth-phone" className="block">
                <Button variant="default" size="lg" className="w-full flex items-center justify-center gap-2 py-6">
                  <Phone className="h-5 w-5" />
                  <span>普通用户：手机号登录/注册</span>
                </Button>
              </Link>
              {import.meta.env.DEV && (
                <Link to="/admin-login" className="block">
                  <Button variant="outline" size="lg" className="w-full flex items-center justify-center gap-2 py-6 border-dashed">
                    <Shield className="h-5 w-5" />
                    <span>管理员演示登录</span>
                  </Button>
                </Link>
              )}
            </div>
            {import.meta.env.DEV && (
              <div className="mt-6 rounded-lg border bg-muted/40 p-4 text-left text-sm">
                <p className="font-semibold mb-2">本地测试账号</p>
                <p>普通用户手机号：13800138000</p>
                <p>短信验证码：123456</p>
                <p className="mt-2">管理员账号：admin</p>
                <p>管理员密码：AdminDemo@123</p>
                <p className="mt-2 text-xs text-muted-foreground">仅限本机开发演示；不会连接 Supabase，也不可用于正式环境。</p>
              </div>
            )}
          </div>
          <div className="text-center mt-6">
            <Link to="/" className="text-primary hover:underline">返回首页</Link>
          </div>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default Login;
