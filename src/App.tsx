import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';

// 页面导入
import Index from './pages/Index';
import Login from './pages/Login';
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
import { useTheme } from './contexts/ThemeContext';

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    // 在组件挂载时从 localStorage 中加载主题
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    }
  }, []);

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      <div className="min-h-screen bg-background text-foreground">
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
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
    </div>
  );
}

export default App;
