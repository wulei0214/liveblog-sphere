
/**
 * 文章卡片组件
 * 
 * 在首页和分类页面中显示文章预览卡片
 * 包含文章标题、摘要、元数据和操作按钮
 */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Eye, Pencil, Tag as TagIcon, Bookmark, BookmarkCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { getCategoryById, getTagById } from '../lib/data';
import type { Post } from '../repositories/postRepository';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getFavoritePostIds, toggleFavoritePost } from '../lib/favorites';
import { Button } from '@/components/ui/button';
import { useTheme } from '../contexts/ThemeContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

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
  const { user, isAdminUser } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(user?.id ? getFavoritePostIds(user.id).includes(post.id) : false);
  }, [user?.id, post.id]);

  const handleToggleFavorite = () => {
    if (!user) {
      toast.error('请先登录后再收藏');
      navigate('/login');
      return;
    }

    const nextFavorite = toggleFavoritePost(user.id, post.id);
    if (nextFavorite === null) {
      toast.error('收藏操作失败，请检查浏览器本地存储后重试');
      return;
    }

    setIsFavorite(nextFavorite);
    toast.success(nextFavorite ? '已加入收藏' : '已取消收藏');
  };
  
  // 获取主要标签（最多显示2个）
  const tags = post.tags && post.tags.length > 0 
    ? post.tags.slice(0, 2).map(tagId => getTagById(tagId)).filter(Boolean)
    : [];
  
  // 确保创建日期是Date对象
  const createdAt = post.createdAt instanceof Date 
    ? post.createdAt 
    : new Date(post.createdAt);
  
  return (
    <div className="h-full">
      <Card className={`h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
        {/* 文章特色图片 */}
        {post.image && (
          <div className="relative w-full h-48 overflow-hidden">
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
        )}
        
        <CardHeader className="pb-2">
          {/* 文章标题 */}
          <Link to={`/post/${post.id}`}>
            <h3 className="text-xl font-bold hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
              {post.title}
            </h3>
          </Link>
        </CardHeader>
        
        <CardContent className="pb-2 flex-grow">
          {/* 文章摘要 */}
          <p className={`line-clamp-2 text-sm min-h-[2.5rem] ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {post.excerpt}
          </p>
          
          <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-4">
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
        </CardContent>
        
        <CardFooter className="pt-2 mt-auto">
          {/* 操作按钮 */}
          <div className="flex justify-between items-center w-full">
            <Button type="button" variant="ghost" size="sm" className={isFavorite ? 'text-primary hover:text-primary' : 'text-gray-500 hover:text-primary'} onClick={handleToggleFavorite} aria-pressed={isFavorite} aria-label={isFavorite ? '取消收藏文章' : '收藏文章'}>
              {isFavorite ? <BookmarkCheck size={14} className="mr-1 fill-current" /> : <Bookmark size={14} className="mr-1" />}
              <span className="text-xs">{isFavorite ? '已收藏' : '收藏'}</span>
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
        </CardFooter>
      </Card>
    </div>
  );
};

export default PostCard;
