
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, BookOpen, Music, Radio, Settings, User, LogOut, MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Menu } from 'lucide-react';

// 普通导航链接
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

interface MobileMenuProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

const MobileMenu = ({ open, onOpenChange }: MobileMenuProps) => {
  const { user, logout, isAuthenticated, isAdminUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onOpenChange(false);
    navigate('/');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px]">
        <SheetHeader>
          <SheetTitle>导航</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col justify-between h-full mt-4">
          <div className="space-y-1.5">
            {/* 用户头像和信息 */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 mb-6 p-2">
                <Avatar>
                  <AvatarFallback>{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{user?.username}</span>
                  <span className="text-xs text-muted-foreground">
                    {isAdminUser ? '管理员' : '用户'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2 mb-6 p-2">
                <Link to="/login" onClick={() => onOpenChange(false)} className="w-full">
                  <Button variant="outline" className="w-full">登录</Button>
                </Link>
              </div>
            )}

            {/* 主导航链接 */}
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => onOpenChange(false)}
                className="flex items-center py-3 px-4 rounded-md hover:bg-accent"
              >
                <span className="mr-3 text-muted-foreground">{link.icon}</span>
                {link.name}
              </Link>
            ))}

            {/* 管理员特殊链接 */}
            {isAdminUser && (
              <>
                <div className="mt-4 mb-2 px-4 text-xs font-semibold text-muted-foreground">
                  管理员功能
                </div>
                <Link
                  to="/admin"
                  onClick={() => onOpenChange(false)}
                  className="flex items-center py-3 px-4 rounded-md hover:bg-accent"
                >
                  <Settings size={18} className="mr-3 text-muted-foreground" />
                  后台管理
                </Link>
                <Link
                  to="/users"
                  onClick={() => onOpenChange(false)}
                  className="flex items-center py-3 px-4 rounded-md hover:bg-accent"
                >
                  <User size={18} className="mr-3 text-muted-foreground" />
                  用户管理
                </Link>
              </>
            )}
          </div>

          {/* 底部操作区 */}
          {isAuthenticated && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-6">
              <Button
                variant="ghost"
                className="flex items-center w-full justify-start px-4"
                onClick={handleLogout}
              >
                <LogOut size={18} className="mr-3" />
                退出登录
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
