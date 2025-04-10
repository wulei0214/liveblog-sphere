
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { UserCircle, LogOut, Settings, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

/**
 * 用户菜单组件，显示登录状态和用户信息
 */
const UserMenu = () => {
  const { user, isAuthenticated, isAdminUser, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // 退出登录处理
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="hidden md:block">
      {isAuthenticated && user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="h-6 w-6 rounded-full"
                />
              ) : (
                <UserCircle className="h-5 w-5" />
              )}
              <span className="text-sm font-medium">
                {user.username}
                {isAdminUser && (
                  <Badge className="ml-2 bg-primary/10 text-primary text-xs">
                    管理员
                  </Badge>
                )}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>用户选项</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem asChild>
              <Link to={`/profile/${user.id}`} className="flex cursor-pointer items-center">
                <UserCircle className="mr-2 h-4 w-4" />
                个人资料
              </Link>
            </DropdownMenuItem>
            
            {/* 管理员专用选项 */}
            {isAdminUser && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="flex cursor-pointer items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    后台管理
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/users" className="flex cursor-pointer items-center">
                    <UserCircle className="mr-2 h-4 w-4" />
                    用户管理
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex gap-2">
          <Link to="/auth-phone">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <Phone className="mr-1 h-4 w-4" />
              手机登录
            </Button>
          </Link>
          <Link to="/login">
            <Button
              variant="default"
              size="sm"
              className="flex items-center"
            >
              <UserCircle className="mr-1 h-4 w-4" />
              登录/注册
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
