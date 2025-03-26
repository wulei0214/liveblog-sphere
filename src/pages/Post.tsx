
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedTransition from '../components/AnimatedTransition';
import { getPostById } from '../lib/data';
import { Calendar, Clock, ArrowLeft, MessageSquare, Share2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

const Post = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const post = getPostById(id || '');
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl mb-4">文章未找到</h2>
        <Button onClick={() => navigate('/')} variant="outline">
          返回首页
        </Button>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      })
      .catch((error) => console.log('分享失败:', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast('链接已复制到剪贴板');
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
            className="max-w-4xl mx-auto"
          >
            <Button 
              variant="ghost" 
              className="mb-6 flex items-center" 
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={18} className="mr-2" />
              返回首页
            </Button>

            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                <span>{post.readTime}</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold mb-6">
              {post.title}
            </h1>
            
            {post.image && (
              <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-8">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            )}

            <div className="prose prose-lg dark:prose-invert mx-auto mb-8">
              <ReactMarkdown>
                {post.content}
              </ReactMarkdown>
            </div>

            <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex items-center space-x-1">
                  <MessageSquare size={16} />
                  <span>评论</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center space-x-1" onClick={handleShare}>
                  <Share2 size={16} />
                  <span>分享</span>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatedTransition>
    </>
  );
};

export default Post;
