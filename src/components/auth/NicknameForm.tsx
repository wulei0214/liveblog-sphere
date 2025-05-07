
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateUserNickname } from '@/repositories/userRepository';
import { useAuth } from '@/contexts/AuthContext';

const NicknameForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 处理昵称设置
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "设置失败",
        description: "请先登录",
        variant: "destructive",
      });
      return;
    }
    
    if (!nickname.trim()) {
      toast({
        title: "设置失败",
        description: "昵称不能为空",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const updatedUser = updateUserNickname(user.id, nickname.trim());
      
      if (!updatedUser) {
        throw new Error("设置昵称失败");
      }
      
      toast({
        title: "设置成功",
        description: "您的昵称已更新",
      });
      
      // 刷新用户信息
      refreshUser();
      
      // 导航到首页
      navigate('/');
      
    } catch (error) {
      toast({
        title: "设置失败",
        description: error instanceof Error ? error.message : "设置昵称过程中发生错误",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="nickname" className="block text-sm font-medium">
          设置昵称
        </label>
        <Input
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="请设置您的昵称"
          disabled={isLoading}
          required
        />
        <p className="text-xs text-gray-500">
          昵称将显示在您的文章和评论中
        </p>
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? '保存中...' : '保存昵称'}
      </Button>
    </form>
  );
};

export default NicknameForm;
