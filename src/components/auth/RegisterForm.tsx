
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { registerUser } from '@/lib/auth';

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // 处理注册表单变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // 处理注册提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password, confirmPassword, email, phone } = registerData;
    
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
    
    setIsLoading(true);
    
    try {
      const user = registerUser(username.trim(), password.trim(), email.trim(), phone.trim());
      
      if (!user) {
        throw new Error("用户名已存在或信息有误");
      }
      
      toast({
        title: "注册成功",
        description: "您可以现在登录了",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "注册失败",
        description: error.message || "用户名已存在或信息有误",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="register-username" className="block text-sm font-medium mb-1">
          用户名
        </label>
        <Input
          id="register-username"
          name="username"
          type="text"
          value={registerData.username}
          onChange={handleChange}
          required
          placeholder="请输入用户名"
          disabled={isLoading}
        />
      </div>
      
      <div>
        <label htmlFor="register-email" className="block text-sm font-medium mb-1">
          邮箱 (选填)
        </label>
        <Input
          id="register-email"
          name="email"
          type="email"
          value={registerData.email}
          onChange={handleChange}
          placeholder="请输入邮箱"
          disabled={isLoading}
        />
      </div>
      
      <div>
        <label htmlFor="register-phone" className="block text-sm font-medium mb-1">
          手机号码 (选填)
        </label>
        <Input
          id="register-phone"
          name="phone"
          type="tel"
          value={registerData.phone}
          onChange={handleChange}
          placeholder="请输入手机号码"
          disabled={isLoading}
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
          onChange={handleChange}
          required
          placeholder="请设置密码"
          disabled={isLoading}
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
          onChange={handleChange}
          required
          placeholder="请再次输入密码"
          disabled={isLoading}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? '注册中...' : '注册'}
      </Button>

      <div className="text-center text-sm">
        <p>或者使用<Button variant="link" className="p-0" onClick={() => navigate('/auth-phone')}>手机号码</Button>注册</p>
      </div>
    </form>
  );
};

export default RegisterForm;
