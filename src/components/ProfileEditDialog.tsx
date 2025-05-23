
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User } from '../lib/data';
import { Loader2 } from 'lucide-react';

// 定义表单验证 Schema
const profileFormSchema = z.object({
  username: z.string().min(1, { message: '用户名不能为空' }),
  email: z.string().email({ message: '请输入有效的电子邮件地址' }).or(z.string().length(0)),
  phone: z.string().regex(/^1\d{10}$/, { message: '请输入有效的11位手机号码' }).or(z.string().length(0)),
  bio: z.string().max(500, { message: '个人简介最多500字符' }).optional(),
  avatar: z.string().url({ message: '请输入有效的URL地址' }).or(z.string().length(0)),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  onSave: (formData: Partial<User>) => void;
}

const ProfileEditDialog = ({ open, onOpenChange, user, onSave }: ProfileEditDialogProps) => {
  // 初始化表单
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user.username,
      email: user.email || '',
      phone: user.phone || '',
      bio: user.bio || '',
      avatar: user.avatar || '',
    },
  });
  
  // 提交表单
  const onSubmit = (values: ProfileFormValues) => {
    // 提交更新
    onSave(values);
    
    // 关闭对话框
    onOpenChange(false);
  };
  
  // 重置表单
  const handleReset = () => {
    form.reset({
      username: user.username,
      email: user.email || '',
      phone: user.phone || '',
      bio: user.bio || '',
      avatar: user.avatar || '',
    });
  };
  
  const isSubmitting = form.formState.isSubmitting;
  
  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        // 关闭对话框时重置表单
        setTimeout(handleReset, 300); 
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>编辑个人资料</DialogTitle>
          <DialogDescription>
            修改您的个人信息。完成后点击保存。
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>用户名</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="请输入用户名" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>电子邮箱</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="your@email.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>手机号码</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="例如：13800138000" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>头像URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://example.com/avatar.jpg" />
                  </FormControl>
                  <p className="text-xs text-gray-500">输入一个有效的图片URL作为头像</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>个人简介</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="介绍一下自己..."
                      rows={3}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                重置
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    保存中...
                  </>
                ) : '保存更改'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;
