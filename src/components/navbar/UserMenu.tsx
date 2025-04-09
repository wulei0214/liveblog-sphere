
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { UserCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

/**
 * 用户菜单组件，显示登录状态和用户信息
 */
const UserMenu = () => {
  const { user, isAuthenticated, isAdminUser, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
    <div className="hidden md:block">
      {isAuthenticated ? (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium flex items-center">
            <UserCircle className="mr-1 h-4 w-4" />
            {user?.username}
            {isAdminUser && (
              <Badge className="ml-2 bg-primary/10 text-primary text-xs">
                管理员
              </Badge>
            )}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center"
          >
            <LogOut className="mr-1 h-4 w-4" />
            退出
          </Button>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default UserMenu;
