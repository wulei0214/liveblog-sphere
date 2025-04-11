
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedTransition from '../components/AnimatedTransition';
import { ArrowLeft } from 'lucide-react';
import { getPostById, deletePost, likePost, hasLiked } from '../lib/data';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

// Import the new components
import PostHeader from '../components/post/PostHeader';
import PostContent from '../components/post/PostContent';
import PostActions from '../components/post/PostActions';
import CommentSection from '../components/post/CommentSection';
import DeletePostAlert from '../components/post/DeletePostAlert';

const Post = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdminUser } = useAuth();
  const [post, setPost] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    // 每次参数或组件更新时刷新文章数据
    if (id) {
      const postData = getPostById(id);
      setPost(postData);
      setIsLiked(postData && hasLiked(id));
    }
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

  const isAuthor = user && user.id === post?.author.id;
  const canModify = isAuthor || isAdminUser;

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error('请先登录后再点赞');
      return;
    }
    
    if (id) {
      const updatedPost = likePost(id);
      if (updatedPost) {
        setPost(updatedPost);
        setIsLiked(!isLiked);
        toast.success(isLiked ? '已取消点赞' : '已点赞');
      }
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

  const handleCommentChange = () => {
    // 刷新文章数据以获取最新的评论
    if (id) {
      setPost(getPostById(id));
    }
  };

  const scrollToComments = () => {
    document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' });
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

            {/* Post Header Component */}
            <PostHeader 
              post={post} 
              canModify={canModify} 
              onEdit={() => navigate(`/edit/${post?.id}`)} 
              onDelete={() => setShowDeleteAlert(true)} 
            />

            {/* Post Content Component */}
            <PostContent post={post} />

            {/* Post Actions Component */}
            <PostActions 
              postId={post.id} 
              likesCount={post.likes?.length || 0} 
              commentsCount={post.comments?.length || 0} 
              isLiked={isLiked} 
              onLike={handleLike} 
              scrollToComments={scrollToComments} 
            />

            {/* Comments Section Component */}
            <CommentSection 
              postId={post.id} 
              comments={post.comments} 
              currentUserId={user?.id} 
              isAdmin={isAdminUser} 
              isAuthenticated={isAuthenticated}
              onCommentChange={handleCommentChange} 
            />
          </motion.div>
        </div>
      </AnimatedTransition>
      
      {/* Delete Post Alert Component */}
      <DeletePostAlert 
        open={showDeleteAlert} 
        onOpenChange={setShowDeleteAlert} 
        onConfirm={handleDelete} 
      />
    </>
  );
};

export default Post;
