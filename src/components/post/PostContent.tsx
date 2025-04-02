
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Post } from '../../lib/data';

interface PostContentProps {
  post: Post;
}

const PostContent = ({ post }: PostContentProps) => {
  return (
    <>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold mb-6">
        {post?.title}
      </h1>
      
      {post?.image && (
        <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-8">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover object-center"
          />
        </div>
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
        <ReactMarkdown>
          {post?.content || ''}
        </ReactMarkdown>
      </div>
    </>
  );
};

export default PostContent;
