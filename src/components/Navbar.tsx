
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, PenLine, User, LogOut, Users, Shield, Home, FilePlus, Music, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, isAdminUser, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3 bg-white/80 dark:bg-black/80 shadow-sm backdrop-blur-md'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
          >
            <div className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground overflow-hidden">
              <PenLine size={18} className="relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70 group-hover:scale-110 transition-transform duration-300"></div>
            </div>
            <span className="text-xl font-serif font-medium tracking-tight">LiveBlog</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" className={navigationMenuTriggerStyle()}>
                    <Home size={16} className="mr-2" />
                    首页
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/create" className={navigationMenuTriggerStyle()}>
                    <FilePlus size={16} className="mr-2" />
                    创建
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/heard" className={navigationMenuTriggerStyle()}>
                    听到
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    href="https://news.cctv.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={navigationMenuTriggerStyle()}
                  >
                    <ArrowRight size={16} className="mr-2" />
                    国家新闻简报
                  </NavigationMenuLink>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <Music size={16} className="mr-2" />
                    音乐
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-4 min-w-[220px]">
                      <div className="mb-2 text-sm font-medium">第三方登录</div>
                      <Link 
                        to="/music/login-qq" 
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent"
                      >
                        <span className="text-blue-500 font-bold">QQ</span>
                        <span>音乐登录</span>
                      </Link>
                      <div className="mt-2 pt-2 border-t">
                        <Link 
                          to="/music" 
                          className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent"
                        >
                          <Music size={16} />
                          <span>进入音乐</span>
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium">
                  <span>欢迎，</span>
                  <span className="text-primary">{user?.username}</span>
                  {isAdminUser && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      <Shield className="h-3 w-3 mr-1" />
                      管理员
                    </span>
                  )}
                </div>
                {isAdminUser && (
                  <Link to="/admin/users" className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-primary">
                    <Users size={16} />
                    <span>用户管理</span>
                  </Link>
                )}
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="flex items-center space-x-1"
                >
                  <LogOut size={16} />
                  <span>退出</span>
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="default" size="sm" className="flex items-center space-x-1">
                  <User size={16} />
                  <span>登录</span>
                </Button>
              </Link>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 animate-slide-down">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 py-2 text-gray-600 dark:text-gray-300 hover:text-primary"
              >
                <Home size={16} />
                <span>首页</span>
              </Link>
              
              <Link 
                to="/create" 
                className="flex items-center space-x-2 py-2 text-gray-600 dark:text-gray-300 hover:text-primary"
              >
                <FilePlus size={16} />
                <span>创建</span>
              </Link>
              
              <Link 
                to="/heard" 
                className="flex items-center space-x-2 py-2 text-gray-600 dark:text-gray-300 hover:text-primary"
              >
                <span>听到</span>
              </Link>
              
              <a 
                href="https://news.cctv.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 py-2 text-gray-600 dark:text-gray-300 hover:text-primary"
              >
                <ArrowRight size={16} />
                <span>国家新闻简报</span>
              </a>
              
              <Link 
                to="/music" 
                className="flex items-center space-x-2 py-2 text-gray-600 dark:text-gray-300 hover:text-primary"
              >
                <Music size={16} />
                <span>音乐</span>
              </Link>
              
              <Link 
                to="/music/login-qq" 
                className="flex items-center space-x-2 py-2 ml-6 text-gray-600 dark:text-gray-300 hover:text-primary"
              >
                <span className="text-blue-500 font-bold">QQ</span>
                <span>音乐登录</span>
              </Link>
              
              {isAuthenticated ? (
                <>
                  <div className="flex items-center py-2">
                    <User size={16} className="mr-2" />
                    <span className="text-sm font-medium">{user?.username}</span>
                    {isAdminUser && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Shield className="h-3 w-3 mr-1" />
                        管理员
                      </span>
                    )}
                  </div>
                  {isAdminUser && (
                    <Link to="/admin/users" className="flex items-center space-x-2 py-2 text-gray-600 dark:text-gray-300 hover:text-primary">
                      <Users size={16} />
                      <span>用户管理</span>
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 py-2 text-gray-600 dark:text-gray-300 hover:text-primary"
                  >
                    <LogOut size={16} />
                    <span>退出</span>
                  </button>
                </>
              ) : (
                <Link to="/login" className="flex items-center space-x-2 py-2 text-gray-600 dark:text-gray-300 hover:text-primary">
                  <User size={16} />
                  <span>登录</span>
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
