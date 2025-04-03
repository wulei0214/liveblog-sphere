
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
import { Eye, FileEdit, Filter, Home, Search, Tag as TagIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '../contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
  const { theme } = useTheme();
  
  // 页面加载时滚动到顶部并检查是否有所有文章
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // 强制刷新数据 - 这是一个测试调试方法
    setTimeout(() => {
      console.log("所有文章:", getAllPosts().length);
      console.log("文章标题列表:", getAllPosts().map(p => `${p.id} - ${p.title}`));
      setFilteredPosts(getAllPosts());
    }, 100);
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
    
    console.log("过滤后的文章数量:", filteredPosts.length);
  }, [searchQuery, posts]);

  return (
    <>
      <Navbar />
      <AnimatedTransition>
        <div className="min-h-screen pt-20 pb-10">
          {/* 顶部横幅 */}
          <div className={`w-full py-16 px-4 sm:px-6 md:py-24 ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
              : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
          }`}>
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-6xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                欢迎访问
              </h1>
              <p className={`text-lg md:max-w-2xl mx-auto ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                这里是记录思考、分享知识和交流想法的地方
              </p>
              
              {/* 搜索框 */}
              <div className="max-w-xl mx-auto mt-8 px-4">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 text-gray-400" size={18} />
                  <Input
                    type="text"
                    placeholder="搜索文章..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-6 h-12 rounded-full border shadow-sm"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-2"
                    aria-label="搜索过滤选项"
                  >
                    <Filter size={18} />
                  </Button>
                </div>
              </div>
              
              {/* 管理员可见的创建按钮 */}
              {isAdminUser && (
                <div className="mt-6">
                  <Link to="/create">
                    <Button size="lg" className="rounded-full flex items-center gap-2">
                      <FileEdit size={16} />
                      创建新文章
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          </div>

          {/* 主要内容区域 */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* 左侧边栏 */}
              <div className="lg:w-1/4 space-y-6">
                {/* 快速导航 */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl flex items-center">
                      <Home className="h-5 w-5 mr-2" />
                      快速导航
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <Link 
                      to="/"
                      className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                        theme === 'dark'
                          ? 'hover:bg-gray-800'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      首页
                    </Link>
                    {categories.map((category) => (
                      <Link 
                        key={category.id}
                        to={`/category/${category.slug}`}
                        className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                          theme === 'dark'
                            ? 'hover:bg-gray-800'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </CardContent>
                </Card>

                {/* 标签云 */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl flex items-center">
                      <TagIcon className="h-5 w-5 mr-2" />
                      热门标签
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                      {popularTags.map(tag => (
                        <Link 
                          key={tag.id}
                          to={`/tag/${tag.slug}`}
                        >
                          <Badge variant="outline" className="rounded-full hover:bg-primary/10">
                            {tag.name}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* 访问说明 */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl flex items-center">
                      <Eye className="h-5 w-5 mr-2" />
                      访问说明
                    </CardTitle>
                    <CardDescription>
                      关于文章的访问和编辑权限
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <Badge variant="outline">访客</Badge>
                        <span>可以阅读和搜索文章</span>
                      </li>
                      <li className="flex gap-2">
                        <Badge variant="outline">管理员</Badge>
                        <span>可以编辑和创建文章</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* 右侧主内容 */}
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
                      <PostCard key={post.id} post={post} index={index} />
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
            </div>
          </div>
        </div>
      </AnimatedTransition>
    </>
  );
};

export default Index;
