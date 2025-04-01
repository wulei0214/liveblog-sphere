
/**
 * 微博页面
 * 展示微博内容，包括热搜和微博帖子
 * 登录用户可以查看关注的信息，未登录用户可以查看热搜榜
 */
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedTransition from '../components/AnimatedTransition';
import Navbar from '../components/Navbar';
import WeiboComponent from '../components/WeiboComponent';
import { useAuth } from '../contexts/AuthContext';

/**
 * 微博页面组件
 * 展示微博热搜和内容
 */
const Heard = () => {
  const { isAuthenticated } = useAuth();
  
  // 页面加载时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <AnimatedTransition>
        <div className="page-container pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto px-4"
          >
            <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-8 text-center">
              微博
              <span className="text-lg text-gray-500 block mt-2">
                {isAuthenticated ? '你关注的实时动态' : '发现实时热点话题'}
              </span>
            </h1>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <WeiboComponent />
            </div>
          </motion.div>
        </div>
      </AnimatedTransition>
    </>
  );
};

export default Heard;
