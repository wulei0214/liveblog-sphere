
/**
 * 网站首页组件
 * 展示博客文章列表和其他功能入口
 */
import React, { useEffect, useState } from 'react';
import { getAllPosts, getAllCategories, getPopularTags } from '../lib/data';
import AnimatedTransition from '../components/AnimatedTransition';
import Navbar from '../components/Navbar';

// 导入拆分的子组件
import Banner from '../components/home/Banner';
import Sidebar from '../components/home/Sidebar';
import PostList from '../components/home/PostList';

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
          <Banner searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          {/* 主要内容区域 */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* 左侧边栏 */}
              <Sidebar categories={categories} popularTags={popularTags} />

              {/* 右侧主内容 */}
              <PostList 
                posts={posts} 
                filteredPosts={filteredPosts} 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
              />
            </div>
          </div>
        </div>
      </AnimatedTransition>
    </>
  );
};

export default Index;
