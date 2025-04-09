
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Twitter, Music, FileEdit, BarChart, Users, UserCircle, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from "../../contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 移动端菜单组件
 */
const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, isAdminUser, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();

  // 处理退出登录
  const handleLogout = () => {
    logout();
    navigate("/");
    onClose();
    toast({
      title: "退出成功",
      description: "您已成功退出登录",
    });
  };

  // 处理链接点击
  const handleLinkClick = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`md:hidden shadow-lg ${
        theme === 'dark' 
          ? 'bg-[#1a1d2d] border-t border-gray-800' 
          : 'bg-white border-t border-gray-100'
      }`}
    >
      <div className="px-4 py-3 space-y-3">
        <Link 
          to="/"
          className="block text-sm font-medium transition-colors hover:text-primary flex items-center py-2"
          onClick={handleLinkClick}
        >
          <Home className="mr-2 h-4 w-4" />
          首页
        </Link>
        
        <Link
          to="/heard" 
          className="block text-sm font-medium transition-colors hover:text-primary flex items-center py-2"
          onClick={handleLinkClick}
        >
          <Twitter className="mr-2 h-4 w-4" />
          微博热搜
        </Link>
        
        <Link
          to="/music"
          className="block text-sm font-medium transition-colors hover:text-primary flex items-center py-2"
          onClick={handleLinkClick}
        >
          <Music className="mr-2 h-4 w-4" />
          音乐
        </Link>
        
        {isAuthenticated && (
          <>
            <Link
              to="/create"
              className="block text-sm font-medium transition-colors hover:text-primary flex items-center py-2"
              onClick={handleLinkClick}
            >
              <FileEdit className="mr-2 h-4 w-4" />
              创建文章
            </Link>
            
            {isAdminUser && (
              <>
                <Link
                  to="/admin"
                  className="block text-sm font-medium transition-colors hover:text-primary flex items-center py-2"
                  onClick={handleLinkClick}
                >
                  <BarChart className="h-4 w-4 mr-2" />
                  管理后台
                </Link>
                <Link
                  to="/users"
                  className="block text-sm font-medium transition-colors hover:text-primary flex items-center py-2"
                  onClick={handleLinkClick}
                >
                  <Users className="h-4 w-4 mr-2" />
                  用户管理
                </Link>
              </>
            )}
            
            <div className="text-sm font-medium flex items-center py-2">
              <UserCircle className="mr-2 h-4 w-4" />
              {user?.username}
              {isAdminUser && (
                <Badge className="ml-2 bg-primary/20 text-primary text-xs">
                  管理员
                </Badge>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center"
            >
              <LogOut className="mr-2 h-4 w-4" />
              退出
            </Button>
          </>
        )}
        {!isAuthenticated && (
          <Link to="/login" onClick={handleLinkClick}>
            <Button
              variant="default"
              size="sm"
              className="w-full flex items-center justify-center"
            >
              <UserCircle className="mr-1 h-4 w-4" />
              登录/注册
            </Button>
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default MobileMenu;
