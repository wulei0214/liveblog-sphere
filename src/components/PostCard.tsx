
/**
 * 文章卡片组件
 * 
 * 在首页和分类页面中显示文章预览卡片
 * 包含文章标题、摘要、元数据和操作按钮
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Eye, Pencil, Tag as TagIcon, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { getCategoryById, getTagById } from '../lib/data';
import type { Post } from '../repositories/postRepository';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useTheme } from '../contexts/ThemeContext';

// 组件属性接口
interface PostCardProps {
  post: Post;         // 文章数据
  index: number;      // 卡片索引，用于动画延迟
}

/**
 * 文章卡片组件
 * 展示文章预览信息，提供链接和操作按钮
 * 
 * @param post 文章数据对象
 * @param index 卡片索引，用于动画延迟
 */
const PostCard: React.FC<PostCardProps> = ({ post, index }) => {
  // 获取分类信息
  const category = post.categoryId ? getCategoryById(post.categoryId) : null;
  const { isAdminUser } = useAuth();
  const { theme } = useTheme();
  
  // 获取主要标签（最多显示2个）
  const tags = post.tags && post.tags.length > 0 
    ? post.tags.slice(0, 2).map(tagId => getTagById(tagId)).filter(Boolean)
    : [];
  
  // 确保创建日期是Date对象
  const createdAt = post.createdAt instanceof Date 
    ? post.createdAt 
    : new Date(post.createdAt);
  
  console.log(`Rendering post: ${post.id} - ${post.title}`);
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.1
      }}
      className={`overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        theme === 'dark' 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-100'
      }`}
    >
      {/* 文章特色图片 */}
      {post.image && (
        <Link to={`/post/${post.id}`} className="block overflow-hidden">
          <div className="relative h-48 overflow-hidden group">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {category && (
              <div className="absolute top-3 left-3 z-10">
                <Link to={`/category/${category.slug}`}>
                  <span className="inline-block bg-primary/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                    {category.name}
                  </span>
                </Link>
              </div>
            )}
          </div>
        </Link>
      )}
      
      <div className="p-5">
        {/* 文章标题 */}
        <Link to={`/post/${post.id}`}>
          <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        
        {/* 文章摘要 */}
        <p className={`mb-4 line-clamp-2 text-sm ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {post.excerpt}
        </p>
        
        <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
          {/* 文章元信息 */}
          <div className="flex items-center space-x-4">
            {/* 发布时间 */}
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>
                {formatDistanceToNow(createdAt, { 
                  addSuffix: true,
                  locale: zhCN
                })}
              </span>
            </div>
            
            {/* 阅读时间 */}
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{post.readTime || 5} 分钟</span>
            </div>
          </div>
          
          {/* 文章标签 */}
          {tags.length > 0 && (
            <div className="flex mt-2 md:mt-0 items-center">
              <TagIcon className="h-3 w-3 mr-1" />
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
        
        {/* 操作按钮 */}
        <div className="flex justify-between items-center mt-3">
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primary">
            <Bookmark size={14} className="mr-1" />
            <span className="text-xs">收藏</span>
          </Button>
          
          <div className="flex gap-2">
            <Link to={`/post/${post.id}`}>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Eye size={14} />
                预览
              </Button>
            </Link>
            
            {isAdminUser && (
              <Link to={`/edit/${post.id}`}>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Pencil size={14} />
                  编辑
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default PostCard;
