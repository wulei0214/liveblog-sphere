
/**
 * Navbar 组件
 * 网站顶部导航栏，提供各页面的导航链接和用户登录状态显示
 */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Settings,
  ChevronDown,
  Users,
  BarChart,
  Home,
  Twitter,
  Music,
  FileEdit,
  LogOut,
  UserCircle,
  Globe // 导入 Globe 图标
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * 页面顶部导航栏组件
 */
const Navbar = () => {
  const { user, isAuthenticated, isAdminUser, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // 监听滚动事件，改变导航栏样式
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 关闭移动端菜单
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // 退出登录处理
  const handleLogout = () => {
    logout();
    navigate("/");
    toast({
      title: "退出成功",
      description: "您已成功退出登录",
    });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm"
          : "bg-white/40 dark:bg-gray-900/40"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 网站Logo/名称 - 使用 Globe 图标替换文字 */}
          <Link
            to="/"
            className="text-xl font-serif font-semibold transition-colors hover:text-primary flex items-center"
          >
            <Globe className="h-6 w-6 mr-1" />
            <span className="sr-only">首页</span>
          </Link>

          {/* 桌面导航 */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-primary flex items-center"
            >
              <Home className="mr-1 h-4 w-4" />
              首页
            </Link>
            <Link
              to="/heard"
              className="text-sm font-medium transition-colors hover:text-primary flex items-center"
            >
              <Twitter className="mr-1 h-4 w-4" />
              微博
            </Link>
            <Link
              to="/music"
              className="text-sm font-medium transition-colors hover:text-primary flex items-center"
            >
              <Music className="mr-1 h-4 w-4" />
              音乐
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/create"
                  className="text-sm font-medium transition-colors hover:text-primary flex items-center"
                >
                  <FileEdit className="mr-1 h-4 w-4" />
                  创建文章
                </Link>
                {isAdminUser && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary -my-1"
                      >
                        <Settings className="h-4 w-4" />
                        管理
                        <ChevronDown className="h-3 w-3 ml-1 opacity-70" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem asChild>
                        <Link to="/admin/dashboard" className="cursor-pointer">
                          <BarChart className="h-4 w-4 mr-2" />
                          <span>管理后台</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/users" className="cursor-pointer">
                          <Users className="h-4 w-4 mr-2" />
                          <span>用户管理</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                >
                  <LogOut className="mr-1 h-4 w-4" />
                  退出
                </Button>
                <span className="text-sm font-medium flex items-center">
                  <UserCircle className="mr-1 h-4 w-4" />
                  {user?.username}
                  {isAdminUser && (
                    <Badge className="ml-2 bg-primary/20 text-primary text-xs">
                      管理员
                    </Badge>
                  )}
                </span>
              </>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate("/login")}
                className="flex items-center"
              >
                <UserCircle className="mr-1 h-4 w-4" />
                登录/注册
              </Button>
            )}
          </nav>

          {/* 移动端菜单按钮 */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* 移动端导航菜单 */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white dark:bg-gray-900 shadow-lg border-t dark:border-gray-800"
          >
            <div className="px-4 py-3 space-y-3">
              <Link
                to="/"
                className="block text-sm font-medium transition-colors hover:text-primary flex items-center"
                onClick={closeMenu}
              >
                <Home className="mr-1 h-4 w-4" />
                首页
              </Link>
              <Link
                to="/heard"
                className="block text-sm font-medium transition-colors hover:text-primary flex items-center"
                onClick={closeMenu}
              >
                <Twitter className="mr-1 h-4 w-4" />
                微博
              </Link>
              <Link
                to="/music"
                className="block text-sm font-medium transition-colors hover:text-primary flex items-center"
                onClick={closeMenu}
              >
                <Music className="mr-1 h-4 w-4" />
                音乐
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/create"
                    className="block text-sm font-medium transition-colors hover:text-primary flex items-center"
                    onClick={closeMenu}
                  >
                    <FileEdit className="mr-1 h-4 w-4" />
                    创建文章
                  </Link>
                  {isAdminUser && (
                    <>
                      <Link
                        to="/admin/dashboard"
                        className="block text-sm font-medium transition-colors hover:text-primary flex items-center"
                        onClick={closeMenu}
                      >
                        <BarChart className="h-4 w-4 mr-1" />
                        管理后台
                      </Link>
                      <Link
                        to="/admin/users"
                        className="block text-sm font-medium transition-colors hover:text-primary flex items-center"
                        onClick={closeMenu}
                      >
                        <Users className="h-4 w-4 mr-1" />
                        用户管理
                      </Link>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="w-full justify-start text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                  >
                    <LogOut className="mr-1 h-4 w-4" />
                    退出
                  </Button>
                  <div className="text-sm font-medium flex items-center">
                    <UserCircle className="mr-1 h-4 w-4" />
                    {user?.username}
                    {isAdminUser && (
                      <Badge className="ml-2 bg-primary/20 text-primary text-xs">
                        管理员
                      </Badge>
                    )}
                  </div>
                </>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  className="w-full flex items-center"
                  onClick={() => {
                    navigate("/login");
                    closeMenu();
                  }}
                >
                  <UserCircle className="mr-1 h-4 w-4" />
                  登录/注册
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
