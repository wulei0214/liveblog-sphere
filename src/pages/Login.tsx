
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AnimatedTransition from '../components/AnimatedTransition';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, UserPlus, LogIn, Phone } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('login');
  
  // 登录表单状态
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  
  // 注册表单状态
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  
  // 检查是否已登录
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate('/');
      }
    });
  }, [navigate]);
  
  // 处理登录表单变化
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // 处理注册表单变化
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // 处理登录提交
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password } = loginData;
    
    if (!username.trim() || !password.trim()) {
      toast({
        title: "登录失败",
        description: "用户名和密码不能为空",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: username.trim() + '@example.com', // 使用用户名模拟邮箱
        password: password.trim(),
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "登录成功",
        description: "欢迎回来！",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "登录失败",
        description: error.message || "用户名或密码不正确",
        variant: "destructive",
      });
    }
  };
  
  // 处理注册提交
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password, confirmPassword } = registerData;
    
    if (!username.trim() || !password.trim()) {
      toast({
        title: "注册失败",
        description: "用户名和密码不能为空",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "注册失败",
        description: "两次输入的密码不一致",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase.auth.signUp({
        email: username.trim() + '@example.com', // 使用用户名模拟邮箱
        password: password.trim(),
        options: {
          data: {
            username: username.trim(),
            role: 'user',
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "注册成功",
        description: "您可以现在登录了",
      });
      
      setActiveTab('login');
      setLoginData({
        username: username.trim(),
        password: '',
      });
    } catch (error) {
      toast({
        title: "注册失败",
        description: error.message || "用户名已存在或信息有误",
        variant: "destructive",
      });
    }
  };
  
  // 跳转到手机登录
  const handlePhoneLogin = () => {
    navigate('/auth-phone');
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
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="login-username" className="block text-sm font-medium mb-1">
                      用户名
                    </label>
                    <Input
                      id="login-username"
                      name="username"
                      type="text"
                      value={loginData.username}
                      onChange={handleLoginChange}
                      required
                      placeholder="请输入用户名"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="login-password" className="block text-sm font-medium mb-1">
                      密码
                    </label>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                      placeholder="请输入密码"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    登录
                  </Button>

                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      或使用其他方式
                    </span>
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={handlePhoneLogin}
                  >
                    <Phone size={16} className="mr-2" />
                    手机号码登录
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="register-username" className="block text-sm font-medium mb-1">
                      用户名
                    </label>
                    <Input
                      id="register-username"
                      name="username"
                      type="text"
                      value={registerData.username}
                      onChange={handleRegisterChange}
                      required
                      placeholder="请输入用户名"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="register-password" className="block text-sm font-medium mb-1">
                      密码
                    </label>
                    <Input
                      id="register-password"
                      name="password"
                      type="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      required
                      placeholder="请设置密码"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">
                      确认密码
                    </label>
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      required
                      placeholder="请再次输入密码"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    注册
                  </Button>

                  <div className="text-center text-sm">
                    <p>或者使用<Button variant="link" className="p-0" onClick={handlePhoneLogin}>手机号码</Button>注册</p>
                  </div>
                </form>
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
