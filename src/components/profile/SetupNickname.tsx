
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

interface SetupNicknameProps {
  userId: string;
  onSuccess: (nickname: string) => void;
  onSkip: () => void;
}

const SetupNickname = ({ userId, onSuccess, onSkip }: SetupNicknameProps) => {
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname.trim()) {
      toast({
        title: "昵称不能为空",
        description: "请输入有效的昵称",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 更新Supabase中的用户资料
      const { error } = await supabase
        .from('profiles')
        .update({ 
          username: nickname.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "昵称设置成功",
        description: `欢迎，${nickname}！`,
      });
      
      // 通知父组件成功
      onSuccess(nickname);
    } catch (error) {
      console.error("设置昵称错误:", error);
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
        <Label htmlFor="nickname">昵称</Label>
        <Input
          id="nickname"
          type="text"
          placeholder="请设置您的昵称"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          disabled={isLoading}
          maxLength={20}
          autoComplete="off"
        />
        <p className="text-xs text-gray-500">
          昵称将显示在您的个人主页和发表的内容中
        </p>
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !nickname.trim()}
      >
        {isLoading ? '保存中...' : '保存昵称'}
      </Button>
      
      <div className="text-center mt-4">
        <Button
          type="button"
          variant="link"
          size="sm"
          onClick={onSkip}
        >
          稍后再设置
        </Button>
      </div>
    </form>
  );
};

export default SetupNickname;
