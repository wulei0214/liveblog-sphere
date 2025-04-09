
import React from "react";
import { Link } from "react-router-dom";
import { Home, Twitter, Music, FileEdit, Settings, ChevronDown, BarChart, Users } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

/**
 * 桌面端导航菜单组件
 */
const DesktopNav = () => {
  const { isAuthenticated, isAdminUser } = useAuth();

  return (
    <nav className="hidden md:flex items-center space-x-1">
      <Link
        to="/"
        className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary hover:bg-primary/5 flex items-center"
      >
        <Home className="mr-1 h-4 w-4" />
        首页
      </Link>
      
      <Link
        to="/heard"
        className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary hover:bg-primary/5 flex items-center"
      >
        <Twitter className="mr-1 h-4 w-4" />
        热搜
      </Link>
      
      <Link
        to="/music"
        className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary hover:bg-primary/5 flex items-center"
      >
        <Music className="mr-1 h-4 w-4" />
        音乐
      </Link>
      
      {isAuthenticated && (
        <Link
          to="/create"
          className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary hover:bg-primary/5 flex items-center"
        >
          <FileEdit className="mr-1 h-4 w-4" />
          创建
        </Link>
      )}
      
      {isAdminUser && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 -my-1"
            >
              <Settings className="h-4 w-4" />
              管理
              <ChevronDown className="h-3 w-3 ml-1 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>
              <Link to="/admin" className="cursor-pointer flex items-center w-full">
                <BarChart className="h-4 w-4 mr-2" />
                <span>管理后台</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/users" className="cursor-pointer flex items-center w-full">
                <Users className="h-4 w-4 mr-2" />
                <span>用户管理</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </nav>
  );
};

export default DesktopNav;
