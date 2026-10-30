import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

import Index from './pages/Index';
import Login from './pages/Login';
import AuthPhone from './pages/AuthPhone';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Post from './pages/Post';
import Create from './pages/Create';
import Edit from './pages/Edit';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Music from './pages/Music';
import Heard from './pages/Heard';
import MusicLoginQQ from './pages/MusicLoginQQ';
import SetNickname from './pages/SetNickname';
import ProfileSetup from './pages/ProfileSetup';

function AppContent() {
  return (
    <div className="min-h-screen bg-background">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth-phone" element={<AuthPhone />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route path="/set-nickname" element={<SetNickname />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/create" element={<Create />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="/profile/:id" element={<Profile />} />
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

function App() {
  return <ThemeProvider><AppContent /></ThemeProvider>;
}

export default App;
