
import React from "react";
import { Link } from "react-router-dom";
import { Globe } from "lucide-react";

/**
 * 网站品牌Logo组件
 */
const NavbarBrand = () => {
  return (
    <Link 
      to="/"
      className="text-xl font-serif font-semibold transition-colors hover:text-primary flex items-center"
    >
      <Globe className="h-6 w-6 mr-2" />
      <span className="hidden sm:inline">知识分享</span>
    </Link>
  );
};

export default NavbarBrand;
