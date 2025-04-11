
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
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // 页面加载时滚动到顶部并加载数据
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // 加载所有数据
    const allPosts = getAllPosts();
    setPosts(allPosts);
    setCategories(getAllCategories());
    setPopularTags(getPopularTags(10));
    setFilteredPosts(allPosts); // 初始化filteredPosts为所有文章
    setIsLoaded(true);
  }, []);

  // 处理搜索，仅当searchQuery变化时执行
  useEffect(() => {
    if (!isLoaded || !posts.length) return; // 如果posts为空或未加载，不执行搜索
    
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
  }, [searchQuery, posts, isLoaded]);

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
