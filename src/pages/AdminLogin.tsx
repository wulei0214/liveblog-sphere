
/**
 * 管理员登录页面
 * 
 * 提供仅限管理员的登录入口
 * 只接受admin用户名的登录
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Lock, ShieldAlert } from 'lucide-react';
import { loginUser } from '@/repositories/userRepository';

// 定义表单验证模式
const adminLoginSchema = z.object({
  username: z.string().refine(val => val === 'admin', {
    message: '只允许管理员登录'
  }),
  password: z.string().min(1, '请输入密码')
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // 初始化表单，默认填入admin用户名
  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      username: 'admin',
      password: ''
    }
  });

  // 如果已经登录为管理员，直接跳转到管理后台
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);
  
  /**
   * 处理管理员登录
   */
  const handleSubmit = async (values: AdminLoginFormValues) => {
    setIsLoading(true);
    
    try {
      // 调用登录服务
      const loggedInUser = loginUser('admin', values.password);
      
      if (!loggedInUser) {
        throw new Error('登录失败，请检查用户名和密码');
      }
      
      if (loggedInUser.role !== 'admin') {
        throw new Error('该账号不是管理员账号');
      }
      
      refreshUser();
      
      toast({
        title: "登录成功",
        description: "欢迎回来，管理员"
      });
      
      // 跳转到管理后台
      navigate('/admin');
    } catch (error) {
      console.error("登录错误:", error);
      toast({
        title: "登录失败",
        description: error instanceof Error ? error.message : "登录过程中发生错误",
        variant: "destructive"
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
            <h1 className="text-3xl font-bold mb-2">管理员登录</h1>
            <div className="flex items-center justify-center text-amber-500">
              <ShieldAlert className="h-5 w-5 mr-1" />
              <p className="text-sm">仅限授权管理员访问</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>管理员账号</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          disabled={true} // 禁止修改，固定为admin
                          className="bg-gray-100"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>密码</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="password"
                          placeholder="请输入管理员密码" 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? '登录中...' : '登录管理后台'}
                </Button>
              </form>
            </Form>
            
            <div className="text-center mt-6">
              <Button
                type="button"
                variant="link"
                onClick={() => navigate('/')}
                className="text-sm"
              >
                返回首页
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default AdminLogin;
