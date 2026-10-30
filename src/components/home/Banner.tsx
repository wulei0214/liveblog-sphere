import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileEdit, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface Option { id: string; name: string; }
interface BannerProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categories: Option[];
  tags: Option[];
  categoryId: string;
  tagId: string;
  sortBy: string;
  onCategoryChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onClearFilters: () => void;
}

const Banner: React.FC<BannerProps> = ({
  searchQuery, setSearchQuery, categories, tags, categoryId, tagId, sortBy,
  onCategoryChange, onTagChange, onSortChange, onClearFilters
}) => {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();

  return (
    <div className={`w-full px-4 py-16 sm:px-6 md:py-24 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'}`}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mx-auto max-w-6xl text-center">
        <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">欢迎访问</h1>
        <p className={`mx-auto text-lg md:max-w-2xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>这里是记录思考、分享知识和交流想法的地方</p>

        <div className="mx-auto mt-8 max-w-xl px-4">
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-gray-400" size={18} />
            <Input type="search" placeholder="搜索文章标题、摘要、正文或标签..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="h-12 rounded-full border py-6 pl-10 pr-14 shadow-sm" aria-label="搜索文章" />
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="absolute right-2" aria-label="打开筛选选项" title="筛选文章">
                  <Filter size={18} />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 space-y-4">
                <div><h3 className="font-semibold">筛选文章</h3><p className="text-xs text-muted-foreground">可与关键词搜索、侧边栏分类和标签组合使用</p></div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">文章分类</label>
                  <Select value={categoryId} onValueChange={onCategoryChange}>
                    <SelectTrigger><SelectValue placeholder="全部分类" /></SelectTrigger>
                    <SelectContent><SelectItem value="all">全部分类</SelectItem>{categories.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">文章标签</label>
                  <Select value={tagId} onValueChange={onTagChange}>
                    <SelectTrigger><SelectValue placeholder="全部标签" /></SelectTrigger>
                    <SelectContent><SelectItem value="all">全部标签</SelectItem>{tags.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">排序方式</label>
                  <Select value={sortBy} onValueChange={onSortChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="newest">最新发布</SelectItem><SelectItem value="oldest">最早发布</SelectItem><SelectItem value="updated">最近更新</SelectItem></SelectContent>
                  </Select>
                </div>
                <Button type="button" variant="outline" className="w-full" onClick={onClearFilters}>重置筛选条件</Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {isAuthenticated && (
          <div className="mt-6 inline-block">
            <Link to="/create"><Button size="lg" className={`flex items-center gap-2 rounded-full ${theme === 'dark' ? 'border border-blue-500 bg-blue-600 text-white hover:bg-blue-700' : 'bg-[#1EAEDB] text-white hover:bg-[#0FA0CE]'}`}><FileEdit size={16} />创建新文章</Button></Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Banner;
