
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, BookOpen, Music, Radio, MessageSquare } from 'lucide-react';

// 导航链接数据
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
  },
  {
    name: '留言板',
    path: '/message-board',
    icon: <MessageSquare size={18} />
  }
];

const DesktopNav = () => {
  return (
    <nav className="hidden md:flex items-center space-x-1">
      {navLinks.map((link) => (
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
