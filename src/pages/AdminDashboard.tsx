import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Users, Eye, Trash2, Edit3, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { getAllPosts, deletePost } from '@/repositories/postRepository';
import { getAllUsers, updateUserRole, deleteUser } from '@/repositories/userRepository';
import type { Post } from '@/models/Post';
import { UserRole, type User } from '@/repositories/user/types';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!isLoading && user?.role !== 'admin') navigate('/admin-login', { replace: true });
  }, [isLoading, user, navigate]);

  const posts = getAllPosts(['published', 'draft', 'scheduled']);
  const users = user?.role === 'admin' ? getAllUsers() : [];

  if (!import.meta.env.DEV) return <Navigate to="/" replace />;
  if (isLoading || user?.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">正在检查本地演示管理员身份…</div>;
  }

  const publishedCount = posts.filter((post) => post.status === 'published').length;
  const draftCount = posts.filter((post) => post.status === 'draft').length;

  const handleDeletePost = (post: Post) => {
    const confirmed = window.confirm('确定删除文章「' + post.title + '」吗？此操作只影响当前浏览器的本地演示数据。');
    if (confirmed && deletePost(post.id)) setRefreshKey((key) => key + 1);
  };
  const roleLabel = (role?: string) => role === 'admin' ? '管理员' : role === 'editor' ? '编辑' : '普通用户';
  const handleToggleEditor = (item: User) => {
    if (item.role === UserRole.ADMIN) return;
    const nextRole = item.role === UserRole.EDITOR ? UserRole.USER : UserRole.EDITOR;
    if (updateUserRole(item.id, nextRole)) setRefreshKey((key) => key + 1);
  };
  const handleDeleteUser = (item: User) => {
    if (item.id === user.id || item.role === UserRole.ADMIN) return;
    const confirmed = window.confirm('确定删除本地演示用户「' + item.username + '」吗？');
    if (confirmed && deleteUser(item.id)) setRefreshKey((key) => key + 1);
  };

  return (
    <>
      <Navbar />
      <AnimatedTransition>
        <main className="mx-auto min-h-screen max-w-7xl px-4 pb-12 pt-24">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4" />本地演示管理后台<Badge variant="outline">LOCAL DEMO</Badge></div>
              <h1 className="text-3xl font-semibold">系统管理</h1>
              <p className="mt-1 text-sm text-muted-foreground">当前以管理员身份登录：{user.username}。所有改动仅保存在本机浏览器。</p>
            </div>
            <div className="flex gap-2"><Button variant="outline" asChild><Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />返回网站</Link></Button><Button asChild><Link to="/create">发布文章</Link></Button></div>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">全部文章</CardTitle><FileText className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{posts.length}</div><p className="text-xs text-muted-foreground">包括已发布、草稿和定时文章</p></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">已发布</CardTitle><Eye className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{publishedCount}</div><p className="text-xs text-muted-foreground">公开展示的文章</p></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">草稿</CardTitle><FileText className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{draftCount}</div><p className="text-xs text-muted-foreground">尚未公开的文章</p></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">用户数量</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{users.length}</div><p className="text-xs text-muted-foreground">本地演示用户记录</p></CardContent></Card>
          </div>

          <section className="mb-8 rounded-xl border bg-card">
            <div className="flex items-center justify-between border-b p-5"><div><h2 className="text-lg font-semibold">全站文章管理</h2><p className="text-sm text-muted-foreground">管理员可以查看、编辑和删除任意文章。</p></div><Button variant="outline" size="sm" onClick={() => setRefreshKey((key) => key + 1)}>刷新列表</Button></div>
            {posts.length === 0 ? <p className="p-8 text-center text-sm text-muted-foreground">暂无文章。可以先返回网站体验或创建一篇演示文章。</p> : (
              <div className="divide-y">{posts.map((post) => (
                <div key={post.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1"><div className="mb-1 flex flex-wrap items-center gap-2"><p className="truncate font-medium">{post.title}</p><Badge variant={post.status === 'published' ? 'default' : 'secondary'}>{post.status === 'published' ? '已发布' : post.status === 'draft' ? '草稿' : '定时发布'}</Badge></div><p className="text-xs text-muted-foreground">作者：{post.author?.username || '未知'} · {new Date(post.createdAt).toLocaleString()}</p></div>
                  <div className="flex shrink-0 gap-2"><Button asChild variant="outline" size="sm"><Link to={'/post/' + post.id}>查看</Link></Button><Button asChild variant="outline" size="sm"><Link to={'/edit/' + post.id}><Edit3 className="mr-1 h-3.5 w-3.5" />编辑</Link></Button><Button variant="destructive" size="sm" onClick={() => handleDeletePost(post)}><Trash2 className="mr-1 h-3.5 w-3.5" />删除</Button></div>
                </div>
              ))}</div>
            )}
          </section>

          <section className="rounded-xl border bg-card">
            <div className="border-b p-5"><h2 className="text-lg font-semibold">用户列表</h2><p className="text-sm text-muted-foreground">查看本地演示用户和角色。正式角色授权将在 Supabase RLS 阶段实现。</p></div>
            <div className="divide-y">{users.map((item: User) => (
              <div key={item.id} className="flex items-center justify-between gap-3 p-4"><div className="min-w-0"><p className="truncate font-medium">{item.username}</p><p className="text-xs text-muted-foreground">{item.phone ? item.phone.slice(0, 3) + '****' + item.phone.slice(-4) : '未填写手机号'}</p></div><div className="flex shrink-0 flex-wrap items-center gap-2"><Badge variant={item.role === 'admin' ? 'default' : 'secondary'}>{roleLabel(item.role)}</Badge>{item.role !== UserRole.ADMIN && <Button size="sm" variant="outline" onClick={() => handleToggleEditor(item)}>{item.role === UserRole.EDITOR ? '设为普通用户' : '设为编辑'}</Button>}{item.id !== user.id && item.role !== UserRole.ADMIN && <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(item)}>删除用户</Button>}</div></div>
            ))}{users.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">暂无用户记录</p>}</div>
          </section>
          <p className="mt-6 text-xs text-muted-foreground">注意：本页面是本地体验用的管理员界面，不构成生产环境的安全权限系统。清理浏览器站点数据会清除演示数据。</p>
        </main>
      </AnimatedTransition>
    </>
  );
};

export default AdminDashboard;
