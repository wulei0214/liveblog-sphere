/**
 * 网站首页：公开文章搜索与组合筛选。
 */
import React, { useEffect, useMemo, useState } from 'react';
import { getAllPosts, getAllCategories, getPopularTags } from '../lib/data';
import type { Post } from '../models/Post';
import type { Category } from '../repositories/categoryRepository';
import type { Tag } from '../repositories/tagRepository';
import { filterAndSortPosts } from '../lib/postListUtils.js';
import AnimatedTransition from '../components/AnimatedTransition';
import Navbar from '../components/Navbar';
import Banner from '../components/home/Banner';
import Sidebar from '../components/home/Sidebar';
import PostList from '../components/home/PostList';

const Index = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [tagId, setTagId] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setPosts(getAllPosts());
    setCategories(getAllCategories());
    setPopularTags(getPopularTags(10));
    setIsLoaded(true);
  }, []);

  const tagNames = useMemo(() => new Map(popularTags.map((tag) => [tag.id, tag.name])), [popularTags]);
  const filteredPosts = useMemo(() => filterAndSortPosts(posts, {
    query: searchQuery, categoryId, tagId, sortBy, tagNames
  }), [posts, searchQuery, categoryId, tagId, sortBy, tagNames]);

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryId('all');
    setTagId('all');
    setSortBy('newest');
  };

  return (
    <>
      <Navbar />
      <AnimatedTransition>
        <div className="min-h-screen pb-10 pt-20">
          <Banner
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categories={categories}
            tags={popularTags}
            categoryId={categoryId}
            tagId={tagId}
            sortBy={sortBy}
            onCategoryChange={setCategoryId}
            onTagChange={setTagId}
            onSortChange={setSortBy}
            onClearFilters={clearFilters}
          />
          <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col gap-8 lg:flex-row">
              <Sidebar
                categories={categories}
                popularTags={popularTags}
                selectedCategoryId={categoryId}
                selectedTagId={tagId}
                onSelectCategory={setCategoryId}
                onSelectTag={(id) => setTagId(tagId === id ? 'all' : id)}
              />
              <PostList
                posts={posts}
                filteredPosts={filteredPosts}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                hasActiveFilters={searchQuery.trim() !== '' || categoryId !== 'all' || tagId !== 'all'}
                onClearFilters={clearFilters}
                isLoaded={isLoaded}
              />
            </div>
          </div>
        </div>
      </AnimatedTransition>
    </>
  );
};

export default Index;
