
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileEdit, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface BannerProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

/**
 * 首页顶部横幅组件
 */
const Banner: React.FC<BannerProps> = ({ searchQuery, setSearchQuery }) => {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  
  return (
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
        
        {/* 任何登录用户都可见的创建按钮 */}
        {isAuthenticated && (
          <div className="mt-6 relative inline-block">
            <Link to="/create">
              <Button 
                size="lg" 
                className={`rounded-full flex items-center gap-2 ${
                  theme === 'dark' 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-500'
                    : 'bg-[#1EAEDB] hover:bg-[#0FA0CE] text-white'
                }`}
              >
                <FileEdit size={16} />
                创建新文章
              </Button>
            </Link>
            {/* 添加点击区域限制，确保只有按钮本身可点击 */}
            <div 
              className="absolute inset-0 -z-10" 
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Banner;
