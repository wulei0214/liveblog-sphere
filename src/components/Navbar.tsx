
/**
 * Navbar 组件
 * 网站顶部导航栏，提供各页面的导航链接和用户登录状态显示
 */
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "@/components/ui/button";

// 导入拆分的子组件
import NavbarBrand from "./navbar/NavbarBrand";
import DesktopNav from "./navbar/DesktopNav";
import UserMenu from "./navbar/UserMenu";
import MobileMenu from "./navbar/MobileMenu";
import ThemeToggle from "./ThemeToggle";

/**
 * 页面顶部导航栏组件
 */
const Navbar = () => {
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 关闭移动端菜单
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // 根据主题确定导航栏样式
  const navbarBgClass = theme === 'dark'
    ? "bg-[#1a1d2d] border-b border-gray-800"
    : "bg-white/90 backdrop-blur-md shadow-md";

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 ${navbarBgClass}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 网站Logo/名称 */}
          <NavbarBrand />

          {/* 桌面导航 */}
          <DesktopNav />

          {/* 右侧工具栏 */}
          <div className="flex items-center gap-2">
            {/* 主题切换 */}
            <ThemeToggle />
            
            {/* 用户状态 */}
            <UserMenu />
            
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
      </div>

      {/* 移动端导航菜单 */}
      <AnimatePresence>
        {isMenuOpen && <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
