
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedTransition from '../components/AnimatedTransition';
import { getPostById, deletePost, addComment, deleteComment } from '../lib/data';
import { Calendar, Clock, ArrowLeft, MessageSquare, Share2, Edit, Trash2, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../contexts/AuthContext';
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Post = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(getPostById(id || ''));
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    // 每次参数或组件更新时刷新文章数据
    setPost(getPostById(id || ''));
  }, [id]);

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

  // Format date for display
  const formattedDate = new Date(post.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const isAuthor = user && user.id === post.author.id;
  const isAdmin = user && user.role === 'admin';
  const canModify = isAuthor || isAdmin;

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

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      const success = deletePost(id);
      if (success) {
        toast.success('文章已删除');
        navigate('/');
      } else {
        toast.error('删除失败，文章可能已不存在');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('删除失败，请重试');
      }
    }
  };

  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      toast.error('请先登录后再评论');
      return;
    }
    
    if (!comment.trim()) {
      toast.error('评论内容不能为空');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newComment = addComment(post.id, comment.trim());
      if (newComment) {
        toast.success('评论已发布');
        setComment('');
        // 刷新文章数据以显示新评论
        setPost(getPostById(id || ''));
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('评论发布失败，请重试');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!id) return;
    
    try {
      const success = deleteComment(id, commentId);
      if (success) {
        toast.success('评论已删除');
        // 刷新文章数据以更新评论列表
        setPost(getPostById(id || ''));
      } else {
        toast.error('删除失败，评论可能已不存在');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('删除失败，请重试');
      }
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

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span>{post.readTime ? `${post.readTime} 分钟阅读` : '5 分钟阅读'}</span>
                </div>
                <div className="text-sm">
                  作者: {post.author.username}
                </div>
              </div>
              
              {canModify && (
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center"
                    onClick={() => navigate(`/edit/${post.id}`)}
                  >
                    <Edit size={16} className="mr-1" />
                    编辑
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center text-red-500 hover:text-red-600"
                    onClick={() => setShowDeleteAlert(true)}
                  >
                    <Trash2 size={16} className="mr-1" />
                    删除
                  </Button>
                </div>
              )}
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

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
              <h3 className="text-xl font-semibold mb-6">评论 ({post.comments.length})</h3>
              
              {isAuthenticated ? (
                <div className="mb-8">
                  <Textarea
                    placeholder="发表你的评论..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full mb-2"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSubmitComment}
                      disabled={isSubmitting}
                      className="flex items-center"
                    >
                      <Send size={16} className="mr-2" />
                      {isSubmitting ? '发布中...' : '发布评论'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-8 text-center">
                  <p className="mb-2">登录后才能发表评论</p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/login')}
                  >
                    去登录
                  </Button>
                </div>
              )}
              
              {post.comments.length > 0 ? (
                <div className="space-y-6">
                  {post.comments.map((comment) => {
                    // Format comment date
                    const commentDate = new Date(comment.createdAt).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    });
                    
                    return (
                      <div key={comment.id} className="flex space-x-4 border-b border-gray-100 dark:border-gray-800 pb-6">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {comment.author.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{comment.author.username}</p>
                              <p className="text-sm text-gray-500">{commentDate}</p>
                            </div>
                            {(user?.id === comment.author.id || isAdmin) && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => handleDeleteComment(comment.id)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            )}
                          </div>
                          <p className="mt-2">{comment.content}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-500 my-8">暂无评论</p>
              )}
              
              <div className="flex justify-between items-center mt-8">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex items-center space-x-1" onClick={handleShare}>
                    <Share2 size={16} />
                    <span>分享</span>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatedTransition>
      
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这篇文章吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDelete}
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Post;
