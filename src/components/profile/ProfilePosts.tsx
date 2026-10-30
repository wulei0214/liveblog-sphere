
import React from 'react';
import PostCard from '../PostCard';
import type { Post } from '@/lib/data';

interface ProfilePostsProps {
  posts: Post[];
}

const ProfilePosts = ({ posts }: ProfilePostsProps) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">暂无文章</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
};

export default ProfilePosts;
