import React from 'react';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PostCard from '../PostCard';
import type { Post } from '../../models/Post';

interface PostListProps {
  posts: Post[];
  filteredPosts: Post[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  isLoaded: boolean;
}

const PostList: React.FC<PostListProps> = ({
  posts, filteredPosts, searchQuery, hasActiveFilters, onClearFilters, isLoaded
}) => (
  <section className="min-w-0 lg:w-3/4" aria-live="polite">
    <div className="mb-6 flex items-center justify-between gap-4">
      <div>
        <h2 className="font-serif text-2xl font-semibold">博客文章</h2>
        {hasActiveFilters && <p className="mt-1 text-sm text-muted-foreground">筛选结果：{filteredPosts.length} 篇文章</p>}
      </div>
      <Badge variant="outline" className="flex shrink-0 items-center gap-1"><Eye size={14} />共 {posts.length} 篇</Badge>
    </div>

    {!isLoaded ? (
      <div className="py-16 text-center text-sm text-muted-foreground">正在加载文章…</div>
    ) : filteredPosts.length > 0 ? (
      <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredPosts.map((post, index) => <div key={post.id} className="h-full"><PostCard post={post} index={index} /></div>)}
      </div>
    ) : (
      <div className="py-16 text-center">
        <p className="text-gray-500 dark:text-gray-400">{searchQuery.trim() ? '没有找到符合关键词的文章' : '暂无符合筛选条件的文章'}</p>
        {hasActiveFilters && <Button type="button" variant="outline" className="mt-4" onClick={onClearFilters}>清除全部筛选</Button>}
      </div>
    )}
  </section>
);

export default PostList;
