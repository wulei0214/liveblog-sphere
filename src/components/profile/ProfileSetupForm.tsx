
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { format } from 'date-fns';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

// 定义表单验证模式
const profileSetupSchema = z.object({
  username: z.string()
    .min(2, '昵称至少需要2个字符')
    .max(20, '昵称不能超过20个字符'),
  birthDate: z.date().optional(),
  bio: z.string().max(200, '个性签名不能超过200个字符').optional(),
  avatar: z.string().optional()
});

type ProfileSetupFormValues = z.infer<typeof profileSetupSchema>;

interface ProfileSetupFormProps {
  onSkip: () => void;
}

const ProfileSetupForm = ({ onSkip }: ProfileSetupFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, refreshUser, supabaseUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // 初始化表单
  const form = useForm<ProfileSetupFormValues>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      username: user?.username || '',
      birthDate: user?.birthDate ? new Date(user.birthDate) : undefined,
      bio: user?.bio || '',
      avatar: user?.avatar || ''
    }
  });
  
  // 当用户数据加载后，更新表单数据
  React.useEffect(() => {
    if (user) {
      form.reset({
        username: user.username || '',
        birthDate: user.birthDate ? new Date(user.birthDate) : undefined,
        bio: user.bio || '',
        avatar: user.avatar || ''
      });
    }
  }, [user, form]);
  
  /**
   * 处理表单提交
   */
  const handleSubmit = async (values: ProfileSetupFormValues) => {
    if (!supabaseUser) {
      toast({
        title: "请先登录",
        description: "您需要先登录才能设置个人资料",
        variant: "destructive",
      });
      navigate('/auth-phone');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 更新Supabase profiles表
      const { data, error } = await supabase
        .from('profiles')
        .update({
          username: values.username,
          bio: values.bio,
          avatar: values.avatar || '/placeholder.svg', // 使用默认头像
          updated_at: new Date().toISOString()
        })
        .eq('id', supabaseUser.id);
      
      if (error) {
        throw error;
      }
      
      // 刷新用户信息
      refreshUser();
      
      toast({
        title: "资料设置成功",
        description: "您的个人资料已成功更新"
      });
      
      // 跳转到首页
      navigate('/');
    } catch (error) {
      console.error("资料更新错误:", error);
      toast({
        title: "资料更新失败",
        description: error instanceof Error ? error.message : "更新资料过程中发生错误",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* 昵称 */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>昵称</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="请输入您的昵称" 
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>昵称将显示在您的个人主页和评论中</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* 生日 */}
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>生日</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isLoading}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>选择日期</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>生日信息将用于个性化推荐</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* 个性签名 */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>个性签名</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="介绍一下自己吧..." 
                  disabled={isLoading}
                  className="resize-none"
                  rows={3}
                />
              </FormControl>
              <FormDescription>
                {field.value ? `${field.value.length}/200` : '0/200'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* TODO: 头像上传功能在此实现 */}
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? '正在保存...' : '保存个人资料'}
        </Button>
        
        <div className="text-center mt-4">
          <Button
            type="button"
            variant="link"
            onClick={onSkip}
            className="text-sm"
          >
            稍后完善，先进入首页
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileSetupForm;
