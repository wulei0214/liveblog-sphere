
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { registerUser } from '@/repositories/userRepository';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface RegisterFormProps {
  onSuccess?: () => void;
}

// 定义表单验证模式
const registerSchema = z.object({
  phone: z.string()
    .min(11, '请输入正确的手机号码')
    .max(11, '请输入正确的手机号码')
    .regex(/^1\d{10}$/, '请输入正确的手机号码格式'),
  password: z.string().min(6, '密码至少需要6个字符'),
  confirmPassword: z.string().min(6, '密码至少需要6个字符'),
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  // 处理注册提交
  const handleSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    
    try {
      const user = registerUser(values.phone.trim(), values.password.trim());
      
      if (!user) {
        throw new Error("注册失败，该手机号可能已被注册");
      }
      
      toast({
        title: "注册成功",
        description: "您可以现在登录了",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("注册错误:", error);
      toast({
        title: "注册失败",
        description: error instanceof Error ? error.message : "注册过程中发生错误",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>手机号码</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  type="tel"
                  placeholder="请输入11位手机号码" 
                  disabled={isLoading}
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
                  placeholder="请设置密码（至少6位）" 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>确认密码</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  type="password"
                  placeholder="请再次输入密码" 
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
          {isLoading ? '注册中...' : '注册'}
        </Button>

        <div className="text-center text-sm">
          <p>注册即代表您同意我们的<Button variant="link" className="p-0">隐私政策</Button>和<Button variant="link" className="p-0">用户协议</Button></p>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
