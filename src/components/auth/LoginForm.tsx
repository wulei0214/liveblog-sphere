
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { loginUser } from '@/lib/auth';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loginData, setLoginData] = useState({
    username: '',
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
    const { username, password } = loginData;
    
    if (!username.trim() || !password.trim()) {
      toast({
        title: "登录失败",
        description: "用户名和密码不能为空",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const user = loginUser(username.trim(), password.trim());
      
      if (!user) {
        throw new Error("用户名或密码不正确");
      }
      
      toast({
        title: "登录成功",
        description: "欢迎回来！",
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "登录失败",
        description: error.message || "用户名或密码不正确",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="login-username" className="block text-sm font-medium mb-1">
          用户名
        </label>
        <Input
          id="login-username"
          name="username"
          type="text"
          value={loginData.username}
          onChange={handleChange}
          required
          placeholder="请输入用户名"
          disabled={isLoading}
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

      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">
          或使用其他方式
        </span>
      </div>
      
      <Button 
        type="button" 
        variant="outline" 
        className="w-full"
        onClick={() => navigate('/auth-phone')}
      >
        <Phone size={16} className="mr-2" />
        手机号码登录
      </Button>
    </form>
  );
};

export default LoginForm;
