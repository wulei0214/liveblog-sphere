import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isSystemTheme: boolean;
  setIsSystemTheme: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSystemTheme, setIsSystemTheme] = useState<boolean>(() => {
    const savedPreference = localStorage.getItem('useSystemTheme');
    return savedPreference ? savedPreference === 'true' : true;
  });
  
  const [theme, setTheme] = useState<Theme>(() => {
    // First check if system theme is enabled
    const savedSystemPreference = localStorage.getItem('useSystemTheme');
    const useSystemTheme = savedSystemPreference ? savedSystemPreference === 'true' : true;
    
    if (useSystemTheme) {
      // Use system preference
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
    }
    
    // Otherwise use saved theme or default to light
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    return (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) 
      ? savedTheme 
      : 'light';
  });

  // Listen for system theme changes
  useEffect(() => {
    if (!isSystemTheme) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isSystemTheme]);

  // Update localStorage and document classes when theme changes
  useEffect(() => {
    if (!isSystemTheme) {
      localStorage.setItem('theme', theme);
    }
    localStorage.setItem('useSystemTheme', String(isSystemTheme));
    
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme, isSystemTheme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    if (isSystemTheme) {
      // If we're using system theme, switch to manual mode with current theme
      setIsSystemTheme(false);
    } else {
      // Just toggle the theme
      setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    }
  };

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

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
