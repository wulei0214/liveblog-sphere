
import React from 'react';
import { Moon, Sun, MonitorSmartphone } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Toggle } from '@/components/ui/toggle';

/**
 * 主题切换组件
 * 允许用户在亮色、深色模式之间切换，或遵循系统设置
 */
const ThemeToggle = () => {
  const { theme, setTheme, isSystemTheme, setIsSystemTheme } = useTheme();

  return (
    <DropdownMenu>
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
      <DropdownMenuContent align="end">
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
        <DropdownMenuItem onClick={() => {
          setIsSystemTheme(true);
          // Set theme based on system preference
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
