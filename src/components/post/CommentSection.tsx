
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Send } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Comment, addComment, deleteComment } from '../../lib/data';
import { toast } from 'sonner';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  currentUserId: string | undefined;
  isAdmin: boolean;
  isAuthenticated: boolean;
  onCommentChange: () => void;
}

const CommentSection = ({ 
  postId, 
  comments, 
  currentUserId, 
  isAdmin, 
  isAuthenticated,
  onCommentChange
}: CommentSectionProps) => {
  const navigate = useNavigate();
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      toast.error('请先登录后再评论');
      return;
    }
    
    if (!commentContent.trim()) {
      toast.error('评论内容不能为空');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newComment = addComment(postId, commentContent.trim());
      if (newComment) {
        toast.success('评论已发布');
        setCommentContent('');
        onCommentChange();
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
    try {
      const success = deleteComment(postId, commentId);
      if (success) {
        toast.success('评论已删除');
        onCommentChange();
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
    <div id="comments-section" className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
      <h3 className="text-xl font-semibold mb-6">评论 ({comments?.length || 0})</h3>
      
      {isAuthenticated ? (
        <div className="mb-8">
          <Textarea
            placeholder="发表你的评论..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
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
      
      {comments && comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => {
            const commentDate = new Date(comment.createdAt).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            
            return (
              <div key={comment.id} className="flex space-x-4 border-b border-gray-100 dark:border-gray-800 pb-6">
                <Avatar 
                  className="cursor-pointer" 
                  onClick={() => navigate(`/profile/${comment.author.id}`)}
                >
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {comment.author.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-0 h-auto font-medium"
                        onClick={() => navigate(`/profile/${comment.author.id}`)}
                      >
                        {comment.author.username}
                      </Button>
                      <p className="text-sm text-gray-500">{commentDate}</p>
                    </div>
                    {(currentUserId === comment.author.id || isAdmin) && (
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
    </div>
  );
};

export default CommentSection;
