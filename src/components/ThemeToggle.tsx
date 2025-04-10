
/**
 * 主题切换组件
 * 提供用户在亮色、深色模式之间切换的功能，或遵循系统设置
 * 使用DropdownMenu实现菜单选择，根据选择的主题显示对应图标
 */

import * as React from 'react';
import { Moon, Sun, MonitorSmartphone } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * 主题切换组件
 * 允许用户在亮色、深色模式之间切换，或遵循系统设置
 */
const ThemeToggle = () => {
  // 从ThemeContext获取主题状态和修改方法
  const { theme, setTheme, isSystemTheme, setIsSystemTheme } = useTheme();

  return (
    <DropdownMenu>
      {/* 主题切换按钮 */}
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          {isSystemTheme ? (
            <MonitorSmartphone className="h-4 w-4" />
          ) : theme === 'light' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      
      {/* 主题选择下拉菜单 */}
      <DropdownMenuContent align="end">
        {/* 亮色模式选项 */}
        <DropdownMenuItem onClick={() => {
          setIsSystemTheme(false);
          setTheme('light');
        }} className="cursor-pointer">
          <Sun className="h-4 w-4 mr-2" />
          <span>亮色</span>
          {!isSystemTheme && theme === 'light' && (
            <span className="ml-auto text-xs text-muted-foreground">已选择</span>
          )}
        </DropdownMenuItem>
        
        {/* 深色模式选项 */}
        <DropdownMenuItem onClick={() => {
          setIsSystemTheme(false);
          setTheme('dark');
        }} className="cursor-pointer">
          <Moon className="h-4 w-4 mr-2" />
          <span>深色</span>
          {!isSystemTheme && theme === 'dark' && (
            <span className="ml-auto text-xs text-muted-foreground">已选择</span>
          )}
        </DropdownMenuItem>
        
        {/* 跟随系统选项 */}
        <DropdownMenuItem onClick={() => {
          setIsSystemTheme(true);
          // 根据系统偏好设置主题
          const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
          setTheme(isDarkMode ? 'dark' : 'light');
        }} className="cursor-pointer">
          <MonitorSmartphone className="h-4 w-4 mr-2" />
          <span>跟随系统</span>
          {isSystemTheme && (
            <span className="ml-auto text-xs text-muted-foreground">已选择</span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
