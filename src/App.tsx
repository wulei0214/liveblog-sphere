
/**
 * 应用程序根组件
 * 
 * 配置应用程序的全局状态提供者和路由结构
 * 整合了主题管理、认证系统和路由导航
 */

import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// 页面导入
import Index from './pages/Index';
import Login from './pages/Login';
import AuthPhone from './pages/AuthPhone';
import Post from './pages/Post';
import Create from './pages/Create';
import Edit from './pages/Edit';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import NotFound from './pages/NotFound';
import Music from './pages/Music';
import Heard from './pages/Heard';
import MusicLoginQQ from './pages/MusicLoginQQ';

/**
 * 应用内容组件
 * 包含应用的主要内容及路由配置
 * 已包装在ThemeProvider内，不需要手动添加主题类
 */
function AppContent() {
  return (
    <div className="min-h-screen bg-background">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth-phone" element={<AuthPhone />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/create" element={<Create />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/music" element={<Music />} />
            <Route path="/heard" element={<Heard />} />
            <Route path="/music-login-qq" element={<MusicLoginQQ />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

/**
 * 应用程序根组件
 * 通过ThemeProvider包装整个应用，提供主题管理功能
 */
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
