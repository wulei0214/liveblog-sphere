
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, BookOpen, Music, Radio, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const DesktopNav = () => {
  const { isAdminUser } = useAuth();
  
  // 基础导航链接数据
  const navLinks = [
    {
      name: '首页',
      path: '/',
      icon: <Home size={18} />
    },
    {
      name: '音乐',
      path: '/music',
      icon: <Music size={18} />
    },
    {
      name: '听闻',
      path: '/heard',
      icon: <Radio size={18} />
    }
  ];
  
  // 管理员专用导航链接
  const adminLinks = isAdminUser ? [
    {
      name: '后台管理',
      path: '/admin',
      icon: <Settings size={18} />
    }
  ] : [];

  // 合并所有链接
  const allLinks = [...navLinks, ...adminLinks];

  return (
    <nav className="hidden md:flex items-center space-x-1">
      {allLinks.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent"
        >
          <span className="mr-1.5">{link.icon}</span>
          {link.name}
        </Link>
      ))}
    </nav>
  );
};

export default DesktopNav;
