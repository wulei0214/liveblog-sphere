
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
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                这里是记录思考、分享知识和交流想法的地方
              </p>
            </div>

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
