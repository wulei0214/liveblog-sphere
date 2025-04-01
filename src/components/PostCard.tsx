
/**
 * PostCard 组件
 * 用于在列表中展示博客文章的卡片
 * 显示文章标题、摘要、发布日期和阅读时间
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { Post } from '../repositories/postRepository';

/**
 * PostCard组件的属性接口
 */
interface PostCardProps {
  post: Post;  // 文章数据
  index: number;  // 文章在列表中的索引，用于动画延迟
}

/**
 * 文章卡片组件
 * 展示文章信息和缩略图，点击可跳转到文章详情页
 */
const PostCard: React.FC<PostCardProps> = ({ post, index }) => {
  // 格式化日期显示
  const formattedDate = new Date(post.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // 格式化阅读时间
  const formattedReadTime = `${post.readTime || 5} 分钟阅读`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card-hover w-full rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
    >
      <Link to={`/post/${post.id}`} className="block h-full">
        {post.image && (
          <div className="relative h-48 w-full overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover object-center transform transition-transform duration-500 hover:scale-110"
            />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              <span>{formattedReadTime}</span>
            </div>
          </div>
          
          <h3 className="text-xl font-serif font-medium mb-2 transition-colors duration-200 group-hover:text-primary">
            {post.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {post.excerpt}
          </p>
          
          <div className="text-primary font-medium">
            阅读全文
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PostCard;
