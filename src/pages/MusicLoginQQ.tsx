
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedTransition from '../components/AnimatedTransition';
import Navbar from '../components/Navbar';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

const MusicLoginQQ = () => {
  const navigate = useNavigate();

  const handleQQLogin = () => {
    // 这里模拟QQ登录，实际项目中应该接入QQ音乐的SDK
    toast.info("QQ音乐登录功能尚未实现，正在开发中...", {
      duration: 3000,
    });
    
    // 模拟登录成功后跳转
    setTimeout(() => {
      navigate('/music');
    }, 2000);
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
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-8 text-center">
              QQ音乐登录
            </h1>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 flex items-center justify-center bg-blue-100 rounded-full mb-6">
                  <span className="text-blue-500 text-xl font-bold">QQ</span>
                </div>
                
                <h2 className="text-xl font-semibold mb-6">使用QQ账号登录音乐服务</h2>
                
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
                  登录后即可享受个性化音乐推荐、收藏喜爱的歌曲，以及更多精彩功能。
                </p>
                
                <Button 
                  onClick={handleQQLogin}
                  className="w-full max-w-xs bg-blue-500 hover:bg-blue-600"
                >
                  QQ账号登录
                </Button>
                
                <p className="mt-4 text-sm text-gray-500">
                  登录即表示您同意相关服务条款和隐私政策
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatedTransition>
    </>
  );
};

export default MusicLoginQQ;
