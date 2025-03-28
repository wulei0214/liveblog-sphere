
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import AnimatedTransition from '../components/AnimatedTransition';
import { getAllPosts } from '../lib/data';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Newspaper, Music, HeadphonesIcon } from 'lucide-react';

/**
 * 网站首页
 * 展示博客文章列表和其他功能入口
 */
const Index = () => {
  const posts = getAllPosts();
  
  // 页面加载时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <AnimatedTransition>
        <div className="page-container py-24">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto px-4"
          >
            <div className="mb-16 text-center">
              <span className="inline-block text-sm font-medium text-primary px-3 py-1 rounded-full bg-primary/10 mb-4">
                个人博客
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold mb-6">
                Yuan Xin
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                这里是记录思考、分享知识和交流想法的地方
              </p>
              
              {/* 功能快捷入口 */}
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <Link to="/heard">
                  <Button variant="outline" className="flex items-center gap-2">
                    <HeadphonesIcon className="h-4 w-4" />
                    <span>听到微博热搜</span>
                  </Button>
                </Link>
                <Link to="/music">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Music className="h-4 w-4" />
                    <span>音乐</span>
                  </Button>
                </Link>
              </div>
            </div>

            <h2 className="text-2xl font-serif font-semibold mb-6 flex items-center">
              <Newspaper className="mr-2 h-5 w-5" />
              博客文章
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {posts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </AnimatedTransition>
    </>
  );
};

export default Index;
