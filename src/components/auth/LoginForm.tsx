
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loginUser } from '@/lib/auth';

const LoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loginData, setLoginData] = useState({
    phone: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // 处理登录表单变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // 处理登录提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { phone, password } = loginData;
    
    if (!phone.trim() || !password.trim()) {
      toast({
        title: "登录失败",
        description: "手机号和密码不能为空",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const user = loginUser(phone.trim(), password.trim());
      
      if (!user) {
        throw new Error("手机号或密码错误");
      }
      
      toast({
        title: "登录成功",
        description: "欢迎回来",
      });
      
      // 检查用户是否需要设置昵称（用户名仍为手机号）
      if (user.username.match(/^1\d{10}$/)) {
        navigate('/set-nickname');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "登录失败",
        description: error instanceof Error ? error.message : "手机号或密码错误",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="login-phone" className="block text-sm font-medium mb-1">
          手机号码
        </label>
        <Input
          id="login-phone"
          name="phone"
          type="tel"
          value={loginData.phone}
          onChange={handleChange}
          required
          placeholder="请输入手机号码"
          disabled={isLoading}
        />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="login-password" className="block text-sm font-medium">
            密码
          </label>
          <Button variant="link" size="sm" className="h-auto p-0">
            忘记密码？
          </Button>
        </div>
        <Input
          id="login-password"
          name="password"
          type="password"
          value={loginData.password}
          onChange={handleChange}
          required
          placeholder="请输入密码"
          disabled={isLoading}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? '登录中...' : '登录'}
      </Button>

      <div className="text-center text-sm">
        <Button variant="link" className="p-0" onClick={() => navigate('/auth-phone')}>
          使用短信验证码登录
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
