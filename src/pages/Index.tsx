
/**
 * 网站首页组件
 * 展示博客文章列表和其他功能入口
 */
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import AnimatedTransition from '../components/AnimatedTransition';
import { getAllPosts, getAllCategories, getPopularTags } from '../lib/data';
import Navbar from '../components/Navbar';
import { Eye, Lock, Pencil, Search, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * 网站首页
 * 展示博客文章列表和其他功能入口
 */
const Index = () => {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const popularTags = getPopularTags(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const { isAdminUser } = useAuth();
  
  // 页面加载时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 处理搜索
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.excerpt.toLowerCase().includes(query)
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  return (
    <>
      <Navbar />
      <AnimatedTransition>
        <div className="page-container py-24">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto px-4"
          >
            <div className="mb-16 text-center">
              {/* 标题信息 */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold mb-6">
                欢迎访问
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                这里是记录思考、分享知识和交流想法的地方
              </p>
              
              {/* 搜索框 */}
              <div className="max-w-md mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    placeholder="搜索文章..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* 管理员可见的创建按钮 */}
              {isAdminUser && (
                <div className="mt-4">
                  <Link to="/create">
                    <Button className="flex items-center gap-2">
                      <Pencil size={16} />
                      创建新文章
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* 内容布局：左侧边栏 + 右侧主内容 */}
            <div className="flex flex-col md:flex-row gap-8">
              {/* 左侧边栏：分类和标签 */}
              <div className="md:w-1/4">
                {/* 分类导航 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
                  <h3 className="text-lg font-medium mb-3 border-b pb-2 dark:border-gray-700">分类导航</h3>
                  <ul className="space-y-2">
                    {categories.map(category => (
                      <li key={category.id}>
                        <Link 
                          to={`/category/${category.slug}`}
                          className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 标签云 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                  <h3 className="text-lg font-medium mb-3 border-b pb-2 dark:border-gray-700 flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    热门标签
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map(tag => (
                      <Link 
                        key={tag.id}
                        to={`/tag/${tag.slug}`}
                        className="inline-block bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm rounded-full px-3 py-1 transition-colors"
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* 访问权限说明 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mt-6">
                  <h3 className="text-lg font-medium mb-3 border-b pb-2 dark:border-gray-700 flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    访问权限
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Eye size={16} /> 
                      <span>所有访客可以查看文章</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Pencil size={16} />
                      <span>只有管理员可以编辑文章</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右侧主内容：文章列表 */}
              <div className="md:w-3/4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif font-semibold">
                    博客文章
                    {searchQuery && <span className="text-lg ml-2 text-gray-500">搜索结果: {filteredPosts.length}</span>}
                  </h2>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Eye size={14} />
                    预览模式
                  </Badge>
                </div>

                {filteredPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {filteredPosts.map((post, index) => (
                      <PostCard key={post.id} post={post} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <p className="text-gray-500 dark:text-gray-400">暂无符合条件的文章</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatedTransition>
    </>
  );
};

export default Index;
