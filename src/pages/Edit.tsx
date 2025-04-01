
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedTransition from '../components/AnimatedTransition';
import { getPostById, updatePost } from '../lib/data';
import Navbar from '../components/Navbar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

const Edit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (!id) return;
    
    const post = getPostById(id);
    if (!post) {
      toast.error('文章不存在');
      navigate('/');
      return;
    }
    
    // 检查当前用户是否有权限编辑
    if (!user || (user.id !== post.author.id && user.role !== 'admin')) {
      toast.error('您没有权限编辑此文章');
      navigate(`/post/${id}`);
      return;
    }
    
    // 填充表单
    setTitle(post.title);
    setContent(post.content);
    setExcerpt(post.excerpt);
    setImage(post.image || '');
  }, [id, user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    if (!title.trim() || !content.trim() || !excerpt.trim()) {
      toast.error('请填写必填字段');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const updatedPost = updatePost(id, {
        title,
        content,
        excerpt,
        image: image || undefined
      });
      
      if (updatedPost) {
        toast.success('文章已更新');
        navigate(`/post/${id}`);
      } else {
        toast.error('更新失败，文章可能已被删除');
        setIsSubmitting(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('更新失败，请重试');
      }
      setIsSubmitting(false);
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
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-8 text-center">
              编辑文章
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium">
                  标题 <span className="text-red-500">*</span>
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="输入文章标题"
                  required
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="excerpt" className="block text-sm font-medium">
                  摘要 <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="简短描述文章内容"
                  required
                  className="w-full"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="image" className="block text-sm font-medium">
                  封面图片URL（可选）
                </label>
                <Input
                  id="image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="输入图片URL"
                  className="w-full"
                />
                {image && (
                  <div className="mt-2 relative h-40 w-full rounded-md overflow-hidden">
                    <img
                      src={image}
                      alt="文章封面预览"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Image+Error';
                        toast.error('图片加载失败，请检查URL');
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="content" className="block text-sm font-medium">
                  内容 <span className="text-red-500">*</span>
                </label>
                <div className="border rounded-md">
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="使用Markdown格式编写文章内容"
                    required
                    className="w-full min-h-[300px] font-mono text-sm"
                    rows={12}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  支持Markdown格式
                </p>
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/post/${id}`)}
                  disabled={isSubmitting}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '保存中...' : '保存更改'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </AnimatedTransition>
    </>
  );
};

export default Edit;
