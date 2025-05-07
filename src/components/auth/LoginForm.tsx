
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loginUser } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRole } from '@/repositories/user/types';

/**
 * 登录表单组件
 * 提供普通用户登录和管理员登录两种方式
 */
const LoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshUser } = useAuth();
  
  // 登录方式标签
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user');
  
  // 普通用户登录数据
  const [loginData, setLoginData] = useState({
    phone: '',
    password: '',
  });
  
  // 管理员登录数据
  const [adminPassword, setAdminPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * 处理普通用户登录表单变化
   * 手机号字段只允许输入数字
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // 如果是手机号码字段，只允许输入数字
    if (name === 'phone' && value !== '') {
      const numericValue = value.replace(/[^\d]/g, '');
      setLoginData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setLoginData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  /**
   * 处理管理员密码输入变化
   */
  const handleAdminPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminPassword(e.target.value);
  };
  
  /**
   * 处理普通用户登录提交
   */
  const handleUserSubmit = async (e: React.FormEvent) => {
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
      
      refreshUser(); // 刷新用户信息
      
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
  
  /**
   * 处理管理员登录提交
   */
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminPassword.trim()) {
      toast({
        title: "登录失败",
        description: "请输入管理员密码",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 使用固定的admin作为手机号登录
      const user = loginUser('admin', adminPassword.trim());
      
      if (!user) {
        throw new Error("管理员密码错误");
      }
      
      // 验证是否为管理员账号
      if (user.role !== UserRole.ADMIN) {
        throw new Error("您不是管理员，无法登录");
      }
      
      toast({
        title: "管理员登录成功",
        description: "欢迎回来，管理员",
      });
      
      refreshUser(); // 刷新用户信息
      navigate('/admin'); // 管理员登录后直接进入管理页面
    } catch (error) {
      toast({
        title: "管理员登录失败",
        description: error instanceof Error ? error.message : "密码错误",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs value={loginType} onValueChange={(value) => setLoginType(value as 'user' | 'admin')} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="user">用户登录</TabsTrigger>
        <TabsTrigger value="admin">管理员登录</TabsTrigger>
      </TabsList>
      
      <TabsContent value="user">
        <form onSubmit={handleUserSubmit} className="space-y-4">
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
              maxLength={11}
              pattern="\d*"
              inputMode="numeric"
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
      </TabsContent>
      
      <TabsContent value="admin">
        <form onSubmit={handleAdminSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-username" className="block text-sm font-medium mb-1">
              管理员账号
            </label>
            <Input
              id="admin-username"
              name="admin-username"
              type="text"
              value="admin"
              disabled={true}
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium mb-1">
              管理员密码
            </label>
            <Input
              id="admin-password"
              name="admin-password"
              type="password"
              value={adminPassword}
              onChange={handleAdminPasswordChange}
              required
              placeholder="请输入管理员密码"
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? '登录中...' : '管理员登录'}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
};

export default LoginForm;
