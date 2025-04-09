
import React from 'react';
import { Home, Tag as TagIcon, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface SidebarProps {
  categories: Category[];
  popularTags: Tag[];
}

/**
 * 首页侧边栏组件
 */
const Sidebar: React.FC<SidebarProps> = ({ categories, popularTags }) => {
  const { theme } = useTheme();
  
  return (
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
          <div 
            className={`block px-3 py-2 rounded-md text-sm transition-colors ${
              theme === 'dark'
                ? 'hover:bg-gray-800'
                : 'hover:bg-gray-100'
            }`}
          >
            首页
          </div>
          {categories.map((category) => (
            <div 
              key={category.id}
              className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-gray-800'
                  : 'hover:bg-gray-100'
              }`}
            >
              {category.name}
            </div>
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
              <Badge 
                key={tag.id}
                variant="outline" 
                className="rounded-full hover:bg-primary/10"
              >
                {tag.name}
              </Badge>
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
  );
};

export default Sidebar;
