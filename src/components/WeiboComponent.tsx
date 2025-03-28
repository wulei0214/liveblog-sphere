
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Twitter, Heart, MessageCircle, RefreshCw, Share2, ExternalLink, TrendingUp, User } from 'lucide-react';
import { getWeiboHotTopics, getWeiboPosts, isLoggedInToWeibo, WeiboHotTopic, WeiboPost } from '../lib/weiboService';
import { useAuth } from '../contexts/AuthContext';

/**
 * 微博组件
 * 展示微博热搜和微博内容，支持已登录和未登录两种状态
 */
const WeiboComponent: React.FC = () => {
  const [hotTopics, setHotTopics] = useState<WeiboHotTopic[]>([]);
  const [posts, setPosts] = useState<WeiboPost[]>([]);
  const [activeTab, setActiveTab] = useState("posts");
  const { isAuthenticated } = useAuth();

  // 加载微博数据
  useEffect(() => {
    // 获取热搜话题
    const topics = getWeiboHotTopics();
    setHotTopics(topics);

    // 获取微博帖子
    const weiboPosts = getWeiboPosts();
    setPosts(weiboPosts);
  }, [isAuthenticated]); // 当登录状态变化时重新加载

  // 格式化数字 (例: 1000 -> 1k)
  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="w-full h-full min-h-[80vh] py-4">
      {/* 微博头部 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Twitter className="mr-2 text-blue-500" />
          <h2 className="text-xl font-serif font-semibold">微博</h2>
        </div>
        {!isAuthenticated && (
          <Link to="/login">
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
              <User className="mr-2 h-4 w-4" /> 登录查看关注内容
            </Button>
          </Link>
        )}
      </div>

      {/* 内容标签页 */}
      <Tabs defaultValue="posts" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts">
            {isAuthenticated ? "我的关注" : "推荐内容"}
          </TabsTrigger>
          <TabsTrigger value="hot">热搜榜</TabsTrigger>
        </TabsList>

        {/* 微博帖子内容 */}
        <TabsContent value="posts" className="mt-4">
          <ScrollArea className="h-[calc(100vh-250px)] w-full pr-4">
            <div className="space-y-6">
              {posts.map((post) => (
                <div 
                  key={post.id} 
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                      <img src={post.avatar} alt={post.username} className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-3 flex-grow">
                      <div className="flex items-center">
                        <span className="font-medium">{post.username}</span>
                        {post.verified && (
                          <span className="ml-1 inline-flex items-center justify-center w-4 h-4 bg-blue-500 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                            </svg>
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{post.handle} · {post.time}</div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{post.content}</p>
                  </div>
                  
                  {post.images.length > 0 && (
                    <div className={`grid ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2 mb-3`}>
                      {post.images.map((img, index) => (
                        <div key={index} className="rounded-lg overflow-hidden bg-gray-100">
                          <img src={img} alt={`Post image ${index}`} className="w-full h-auto" />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-500 pt-2">
                    <button className="flex items-center hover:text-blue-500">
                      <MessageCircle size={18} className="mr-1" />
                      <span>{formatNumber(post.comments)}</span>
                    </button>
                    <button className="flex items-center hover:text-green-500">
                      <RefreshCw size={18} className="mr-1" />
                      <span>{formatNumber(post.reposts)}</span>
                    </button>
                    <button className="flex items-center hover:text-red-500">
                      <Heart size={18} className="mr-1" />
                      <span>{formatNumber(post.likes)}</span>
                    </button>
                    <button className="flex items-center hover:text-primary">
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* 热搜榜内容 */}
        <TabsContent value="hot" className="mt-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center mb-4">
              <TrendingUp className="mr-2 text-red-500" />
              <h3 className="font-semibold">热搜榜</h3>
            </div>
            <ScrollArea className="h-[calc(100vh-300px)] w-full">
              <div className="space-y-3">
                {hotTopics.map((topic, index) => (
                  <a 
                    key={topic.id}
                    href={topic.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg group"
                  >
                    <span className={`w-6 flex justify-center font-bold ${
                      index < 3 ? 'text-red-500' : 'text-gray-400'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="ml-3 flex-grow font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-500">
                      {topic.title}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatNumber(topic.hot)}
                    </span>
                    <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-500">
                      {topic.category}
                    </span>
                  </a>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          <div className="mt-4 text-center">
            <a 
              href="https://s.weibo.com/top/summary" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary hover:underline"
            >
              查看完整热搜榜 <ExternalLink size={14} className="ml-1" />
            </a>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-4 text-center">
        <a 
          href="https://weibo.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-primary hover:underline"
        >
          访问微博官网 <ExternalLink size={14} className="ml-1" />
        </a>
      </div>
    </div>
  );
};

export default WeiboComponent;
