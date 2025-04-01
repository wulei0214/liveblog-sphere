
/**
 * 网站首页组件
 * 展示博客文章列表和其他功能入口
 */
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import AnimatedTransition from '../components/AnimatedTransition';
import { getAllPosts } from '../lib/data';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { BarChart, Music, Twitter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

/**
 * 网站首页
 * 展示博客文章列表和其他功能入口
 */
const Index = () => {
  const posts = getAllPosts();
  const { isAdminUser } = useAuth();
  
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
              {/* 标题信息 */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold mb-6">
                欢迎访问
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                这里是记录思考、分享知识和交流想法的地方
              </p>
              
              {/* 功能快捷入口 */}
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <Link to="/heard">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    <span>微博热搜</span>
                  </Button>
                </Link>
                <Link to="/music">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Music className="h-4 w-4" />
                    <span>音乐</span>
                  </Button>
                </Link>
                {isAdminUser && (
                  <Link to="/admin/dashboard">
                    <Button variant="outline" className="flex items-center gap-2">
                      <BarChart className="h-4 w-4" />
                      <span>管理后台</span>
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* 博客文章列表 */}
            <h2 className="text-2xl font-serif font-semibold mb-6 flex items-center">
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
