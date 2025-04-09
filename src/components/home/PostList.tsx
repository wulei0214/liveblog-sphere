
import React from 'react';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PostCard from '../PostCard';
import type { Post } from '../../repositories/postRepository';

interface PostListProps {
  posts: Post[];
  filteredPosts: Post[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

/**
 * 文章列表组件
 */
const PostList: React.FC<PostListProps> = ({ 
  posts, 
  filteredPosts, 
  searchQuery, 
  setSearchQuery 
}) => {
  return (
    <div className="lg:w-3/4">
      {/* 文章列表头部 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-serif font-semibold">
            博客文章
          </h2>
          {searchQuery && (
            <p className="text-sm text-gray-500 mt-1">
              搜索结果: {filteredPosts.length} 篇文章
            </p>
          )}
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Eye size={14} />
          共 {posts.length} 篇
        </Badge>
      </div>

      {/* 文章列表 */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {filteredPosts.map((post, index) => (
            <div key={post.id} className="h-full">
              <PostCard post={post} index={index} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400">暂无符合条件的文章</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setSearchQuery('')}
          >
            清除搜索
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostList;
