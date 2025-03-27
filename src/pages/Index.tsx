
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import PostCard from '../components/PostCard';
import AnimatedTransition from '../components/AnimatedTransition';
import { getAllPosts } from '../lib/data';
import Navbar from '../components/Navbar';

const Index = () => {
  const posts = getAllPosts();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-400 to-blue-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 1440 800" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" 
                  fill="rgba(255, 255, 255, 0.1)" fillOpacity="0.5"></path>
            <path d="M0,96L48,128C96,160,192,224,288,213.3C384,203,480,117,576,117.3C672,117,768,203,864,234.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" 
                  fill="rgba(255, 255, 255, 0.05)" fillOpacity="0.5"></path>
          </svg>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 min-h-screen flex flex-col justify-center">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-7/12">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-7xl font-serif font-bold mb-6 text-white tracking-wider"
              >
                Yuan Xin
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-xl text-white/80 mb-10"
              >
                Gather interesting people, and ...
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="space-y-4 text-white/90"
              >
                <a href="/" className="block hover:text-white transition-colors">博客</a>
                <a href="/music" className="block hover:text-white transition-colors">歌台</a>
                <a href="/heard" className="block hover:text-white transition-colors">友站</a>
                <a href="/about" className="block hover:text-white transition-colors">关于</a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">Github</a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <AnimatedTransition>
        <div className="page-container py-16 bg-white">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <span className="inline-block text-sm font-medium text-primary px-3 py-1 rounded-full bg-primary/10 mb-4">
              个人博客
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold mb-6">
              分享想法，记录生活
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              这里是我记录思考、分享知识和交流想法的地方。欢迎光临我的博客空间。
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {posts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </div>
      </AnimatedTransition>
    </>
  );
};

export default Index;
