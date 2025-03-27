
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedTransition from '../components/AnimatedTransition';
import Navbar from '../components/Navbar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { loginToQQMusic } from '../lib/qqMusicService';

const MusicLoginQQ = () => {
  const navigate = useNavigate();
  const [qqId, setQqId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!qqId) {
      toast.error("请输入QQ号");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would validate credentials with QQ
      const success = await loginToQQMusic(qqId);
      
      if (success) {
        toast.success("QQ音乐登录成功", {
          duration: 3000,
        });
        
        // Redirect to music page
        setTimeout(() => {
          navigate('/music');
        }, 1500);
      } else {
        toast.error("登录失败，请检查您的QQ号");
      }
    } catch (error) {
      toast.error("登录过程中发生错误");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Simplified QQ login for demo purposes
  const handleQuickLogin = async () => {
    setIsLoading(true);
    
    try {
      // Use a demo account
      const success = await loginToQQMusic('123456789');
      
      if (success) {
        toast.success("演示账号登录成功", {
          duration: 3000,
        });
        
        setTimeout(() => {
          navigate('/music');
        }, 1500);
      }
    } catch (error) {
      toast.error("登录过程中发生错误");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <AnimatedTransition>
        <div className="page-container pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-8 text-center">
              QQ音乐登录
            </h1>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 flex items-center justify-center bg-blue-100 rounded-full mb-6">
                  <span className="text-blue-500 text-xl font-bold">QQ</span>
                </div>
                
                <h2 className="text-xl font-semibold mb-2">使用QQ账号登录音乐服务</h2>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-center text-sm">
                  登录后即可享受个性化音乐推荐、收藏喜爱的歌曲，以及更多精彩功能。
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="qqId">QQ号</Label>
                  <Input 
                    id="qqId"
                    type="text"
                    placeholder="请输入QQ号"
                    value={qqId}
                    onChange={(e) => setQqId(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">QQ密码</Label>
                  <Input 
                    id="password"
                    type="password"
                    placeholder="请输入QQ密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  disabled={isLoading}
                >
                  {isLoading ? "登录中..." : "QQ账号登录"}
                </Button>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">或者</span>
                  </div>
                </div>
                
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleQuickLogin}
                  disabled={isLoading}
                >
                  快速体验 (演示账号)
                </Button>
                
                <p className="mt-4 text-xs text-center text-gray-500">
                  登录即表示您同意相关服务条款和隐私政策
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </AnimatedTransition>
    </>
  );
};

export default MusicLoginQQ;
