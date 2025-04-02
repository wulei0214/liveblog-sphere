
import React from 'react';
import { Heart, MessageSquare, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PostActionsProps {
  postId: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  onLike: () => void;
  scrollToComments: () => void;
}

const PostActions = ({ 
  postId, 
  likesCount, 
  commentsCount, 
  isLiked, 
  onLike, 
  scrollToComments 
}: PostActionsProps) => {
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Share this post',
        text: 'Check out this post',
        url: window.location.href,
      })
      .catch((error) => console.log('分享失败:', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast('链接已复制到剪贴板');
    }
  };

  return (
    <div className="flex justify-between items-center mt-8 mb-6 border-t border-b border-gray-200 dark:border-gray-700 py-4">
      <div className="flex space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : ''}`}
          onClick={onLike}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          <span>{likesCount} 点赞</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center space-x-1"
          onClick={scrollToComments}
        >
          <MessageSquare size={18} />
          <span>{commentsCount} 评论</span>
        </Button>
      </div>
      
      <Button variant="ghost" size="sm" className="flex items-center space-x-1" onClick={handleShare}>
        <Share2 size={18} />
        <span>分享</span>
      </Button>
    </div>
  );
};

export default PostActions;
