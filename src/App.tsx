
/**
 * 应用程序入口组件
 * 配置路由和全局提供者
 */
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./contexts/AuthContext";

// 页面组件
import Index from "./pages/Index";
import Post from "./pages/Post";
import Create from "./pages/Create";
import Edit from "./pages/Edit";
import Login from "./pages/Login";
import UserManagement from "./pages/UserManagement";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Heard from "./pages/Heard";
import Music from "./pages/Music";
import MusicLoginQQ from "./pages/MusicLoginQQ";

// 创建React Query客户端
const queryClient = new QueryClient();

/**
 * 应用程序入口组件
 * 配置路由和全局提供者
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              {/* 首页路由 */}
              <Route path="/" element={<Index />} />
              {/* 文章详情页路由 */}
              <Route path="/post/:id" element={<Post />} />
              {/* 创建文章页路由 */}
              <Route path="/create" element={<Create />} />
              {/* 编辑文章页路由 */}
              <Route path="/edit/:id" element={<Edit />} />
              {/* 登录页路由 */}
              <Route path="/login" element={<Login />} />
              {/* 用户管理页路由 */}
              <Route path="/admin/users" element={<UserManagement />} />
              {/* 管理后台页路由 */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              {/* 微博页路由 */}
              <Route path="/heard" element={<Heard />} />
              {/* 音乐页路由 */}
              <Route path="/music" element={<Music />} />
              {/* QQ音乐登录页路由 */}
              <Route path="/music/login-qq" element={<MusicLoginQQ />} />
              {/* 404页面路由 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
