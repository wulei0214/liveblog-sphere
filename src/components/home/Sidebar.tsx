import React from 'react';
import { Home, Tag as TagIcon, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Category { id: string; name: string; }
interface Tag { id: string; name: string; }
interface SidebarProps {
  categories: Category[];
  popularTags: Tag[];
  selectedCategoryId: string;
  selectedTagId: string;
  onSelectCategory: (id: string) => void;
  onSelectTag: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  categories, popularTags, selectedCategoryId, selectedTagId,
  onSelectCategory, onSelectTag
}) => (
  <aside className="space-y-6 lg:w-1/4">
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-xl"><Home className="mr-2 h-5 w-5" />快速导航</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 pt-0">
        <Button type="button" variant={selectedCategoryId === 'all' ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => onSelectCategory('all')} aria-pressed={selectedCategoryId === 'all'}>
          首页 / 全部分类
        </Button>
        {categories.map((category) => (
          <Button key={category.id} type="button" variant={selectedCategoryId === category.id ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => onSelectCategory(category.id)} aria-pressed={selectedCategoryId === category.id}>
            {category.name}
          </Button>
        ))}
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-xl"><TagIcon className="mr-2 h-5 w-5" />热门标签</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Button key={tag.id} type="button" size="sm" variant={selectedTagId === tag.id ? 'default' : 'outline'} className="h-8 rounded-full" onClick={() => onSelectTag(selectedTagId === tag.id ? 'all' : tag.id)} aria-pressed={selectedTagId === tag.id}>
              {tag.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-xl"><Eye className="mr-2 h-5 w-5" />访问说明</CardTitle>
        <CardDescription>文章阅读与编辑权限</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2"><Badge variant="outline">访客</Badge><span>可以阅读和搜索已发布文章</span></li>
          <li className="flex gap-2"><Badge variant="outline">作者</Badge><span>可以发布并管理自己的文章</span></li>
          <li className="flex gap-2"><Badge variant="outline">编辑 / 管理员</Badge><span>可以按权限管理全站文章</span></li>
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">以上为产品权限说明；正式环境权限由服务端和数据库策略执行。</p>
      </CardContent>
    </Card>
  </aside>
);

export default Sidebar;
