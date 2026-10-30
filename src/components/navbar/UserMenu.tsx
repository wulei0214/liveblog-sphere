import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserCircle, LogOut, Settings, Phone, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const UserMenu = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await logout();
    toast({ title: '已退出登录', description: '您已成功退出系统' });
    navigate('/');
  };

  return (
    <div className="hidden md:block">
      {isAuthenticated && user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} className="h-6 w-6 rounded-full" />
              ) : (
                <UserCircle className="h-5 w-5" />
              )}
              <span className="text-sm font-medium">{user.username}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              {user.username}
              <span className="block text-xs font-normal text-muted-foreground">
                {user.role === 'admin' ? '本地演示管理员' : '普通用户'}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user.role === 'admin' && (
              <DropdownMenuItem asChild>
                <Link to="/admin" className="flex cursor-pointer items-center">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  管理后台
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link to={'/profile/' + user.id} className="flex cursor-pointer items-center">
                <UserCircle className="mr-2 h-4 w-4" />
                个人资料
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/profile-setup" className="flex cursor-pointer items-center">
                <Settings className="mr-2 h-4 w-4" />
                修改资料
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link to="/login">
          <Button variant="default" size="sm" className="flex items-center">
            <Phone className="mr-1 h-4 w-4" />
            登录
          </Button>
        </Link>
      )}
    </div>
  );
};

export default UserMenu;
