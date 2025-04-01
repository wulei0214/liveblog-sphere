
/**
 * 文章卡片组件
 * 在首页和分类页面中显示文章预览卡片
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Tag as TagIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Post, getCategoryById, getTagById } from '../lib/data';

interface PostCardProps {
  post: Post;
  index: number;
}

/**
 * 文章卡片组件
 * @param post 文章数据
 * @param index 卡片索引，用于动画延迟
 */
const PostCard: React.FC<PostCardProps> = ({ post, index }) => {
  // 获取分类信息
  const category = post.categoryId ? getCategoryById(post.categoryId) : null;
  
  // 获取主要标签（最多显示2个）
  const tags = post.tags.slice(0, 2).map(tagId => getTagById(tagId)).filter(tag => tag !== null);
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.1
      }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* 文章图片 */}
      {post.image && (
        <Link to={`/post/${post.id}`}>
          <div className="h-48 overflow-hidden">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
        </Link>
      )}
      
      <div className="p-5">
        {/* 分类标签 */}
        {category && (
          <Link to={`/category/${category.slug}`}>
            <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-md mb-2">
              {category.name}
            </span>
          </Link>
        )}
        
        {/* 文章标题 */}
        <Link to={`/post/${post.id}`}>
          <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>
        
        {/* 文章摘要 */}
        <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {post.excerpt}
        </p>
        
        <div className="flex flex-wrap items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          {/* 文章元信息 */}
          <div className="flex items-center space-x-4">
            {/* 发布时间 */}
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>
                {formatDistanceToNow(new Date(post.createdAt), { 
                  addSuffix: true,
                  locale: zhCN
                })}
              </span>
            </div>
            
            {/* 阅读时间 */}
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{post.readTime} 分钟</span>
            </div>
          </div>
          
          {/* 标签 */}
          {tags.length > 0 && (
            <div className="flex mt-2 md:mt-0 items-center space-x-2">
              <TagIcon className="h-3 w-3" />
              <div className="flex space-x-1">
                {tags.map(tag => tag && (
                  <Link key={tag.id} to={`/tag/${tag.slug}`}>
                    <span className="text-xs hover:text-primary transition-colors">
                      {tag.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default PostCard;
