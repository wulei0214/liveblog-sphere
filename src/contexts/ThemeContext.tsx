
/**
 * 主题上下文模块
 * 提供全局主题管理功能，支持亮色/深色模式切换和系统主题跟随
 */
import React, { createContext, useContext, useEffect, useState } from 'react';

// 主题类型定义
type Theme = 'light' | 'dark';

// 主题上下文接口定义
interface ThemeContextType {
  theme: Theme;                         // 当前主题
  setTheme: (theme: Theme) => void;     // 设置主题方法
  toggleTheme: () => void;              // 切换主题方法
  isSystemTheme: boolean;               // 是否跟随系统主题
  setIsSystemTheme: (value: boolean) => void; // 设置是否跟随系统主题
}

// 创建主题上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * 主题提供者组件
 * 管理主题状态，提供主题切换功能
 * @param children 子组件
 */
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // 初始化是否使用系统主题，优先从localStorage获取
  const [isSystemTheme, setIsSystemTheme] = useState<boolean>(() => {
    const savedPreference = localStorage.getItem('useSystemTheme');
    return savedPreference ? savedPreference === 'true' : true;
  });
  
  // 初始化主题状态
  const [theme, setTheme] = useState<Theme>(() => {
    // 首先检查是否启用系统主题
    const savedSystemPreference = localStorage.getItem('useSystemTheme');
    const useSystemTheme = savedSystemPreference ? savedSystemPreference === 'true' : true;
    
    if (useSystemTheme) {
      // 使用系统偏好
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
    }
    
    // 否则使用保存的主题或默认为亮色
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    return (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) 
      ? savedTheme 
      : 'light';
  });

  // 监听系统主题变化
  useEffect(() => {
    if (!isSystemTheme) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isSystemTheme]);

  // 更新localStorage和文档类名
  useEffect(() => {
    if (!isSystemTheme) {
      localStorage.setItem('theme', theme);
    }
    localStorage.setItem('useSystemTheme', String(isSystemTheme));
    
    // 更新文档根元素类名以应用主题样式
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme, isSystemTheme]);

  // 切换亮色/深色主题
  const toggleTheme = () => {
    if (isSystemTheme) {
      // 如果当前使用系统主题，则切换到手动模式并保持当前主题
      setIsSystemTheme(false);
    } else {
      // 直接切换主题
      setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    }
  };

  // 提供上下文值给子组件
  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      toggleTheme,
      isSystemTheme,
      setIsSystemTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * 自定义hook，用于访问主题上下文
 * @returns 主题上下文对象
 * @throws 如果在ThemeProvider外使用则抛出错误
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
