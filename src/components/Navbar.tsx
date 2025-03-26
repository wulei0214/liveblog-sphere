
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, PenLine, User, LogOut, Users, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

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
            <NavLinks />
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
              <NavLinks />
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

const NavLinks: React.FC = () => {
  const location = useLocation();
  
  const links = [
    { name: '首页', path: '/' },
    { name: '创建', path: '/create' },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={`relative text-base font-medium tracking-wide 
            ${location.pathname === link.path 
              ? 'text-primary' 
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
            }
            after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-primary 
            after:transition-all after:duration-300
            ${location.pathname === link.path 
              ? 'after:w-full' 
              : 'after:w-0 hover:after:w-full'
            }
          `}
        >
          {link.name}
        </Link>
      ))}
    </>
  );
};

export default Navbar;
