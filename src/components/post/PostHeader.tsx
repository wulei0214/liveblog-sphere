
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Post } from '../../lib/data';
import { Badge } from '@/components/ui/badge';

interface PostHeaderProps {
  post: Post;
  canModify: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const PostHeader = ({ post, canModify, onEdit, onDelete }: PostHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar size={16} className="mr-1" />
            <span>{post && new Date(post.createdAt).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{post?.readTime ? `${post.readTime} 分钟阅读` : '5 分钟阅读'}</span>
          </div>
          <div className="text-sm">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-auto font-normal"
              onClick={() => post?.author?.id && navigate(`/profile/${post.author.id}`)}
            >
              作者: {post?.author.username}
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!canModify && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Lock size={14} />
              管理员专属编辑
            </Badge>
          )}
        </div>
        
        {canModify && (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center"
              onClick={onEdit}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              编辑
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center text-red-500 hover:text-red-600"
              onClick={onDelete}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
              删除
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default PostHeader;
