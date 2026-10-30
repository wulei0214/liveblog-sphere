import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Users, Eye, Trash2, Edit3, ShieldCheck, Search, RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { getAllPosts, deletePost } from '@/repositories/postRepository';
import { getAllCategories, getAllTags } from '@/lib/data';
import { getAllUsers, updateUserRole, deleteUser } from '@/repositories/userRepository';
import { filterAndSortPosts, paginateItems } from '@/lib/postListUtils.js';
import type { Post } from '@/models/Post';
import { UserRole, type User } from '@/repositories/user/types';

const formatDate = (value?: Date | string) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('zh-CN');
};

const statusLabel = (status: Post['status']) =>
  status === 'published' ? '已发布' : status === 'draft' ? '草稿' : '定时发布';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<ReturnType<typeof getAllCategories>>([]);
  const [tags, setTags] = useState<ReturnType<typeof getAllTags>>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('updated');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && user?.role !== 'admin') navigate('/admin-login', { replace: true });
  }, [isLoading, user, navigate]);

  useEffect(() => {
    setPosts(getAllPosts(['published', 'draft', 'scheduled']));
    setUsers(user?.role === 'admin' ? getAllUsers() : []);
    setCategories(getAllCategories());
    setTags(getAllTags());
  }, [user, refreshKey]);
  const categoryNames = useMemo(() => new Map(categories.map((item) => [item.id, item.name])), [categories]);
  const tagNames = useMemo(() => new Map(tags.map((item) => [item.id, item.name])), [tags]);

  const filteredPosts = useMemo(() => filterAndSortPosts(posts, { query, status, sortBy, tagNames }), [posts, query, status, sortBy, tagNames]);
  const pagination = useMemo(() => paginateItems(filteredPosts, page, pageSize), [filteredPosts, page, pageSize]);
  const pageIds = pagination.items.map((post) => post.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));

  useEffect(() => { setPage(1); }, [query, status, sortBy, pageSize]);
  useEffect(() => {
    setSelectedIds((current) => current.filter((id) => posts.some((post) => post.id === id)));
  }, [posts]);

  if (!import.meta.env.DEV) return <Navigate to="/" replace />;
  if (isLoading || user?.role !== 'admin') {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">正在检查本地演示管理员身份…</div>;
  }

  const publishedCount = posts.filter((post) => post.status === 'published').length;
  const draftCount = posts.filter((post) => post.status === 'draft').length;
  const scheduledCount = posts.filter((post) => post.status === 'scheduled').length;

  const handleDeletePost = (post: Post) => {
    const confirmed = window.confirm(`确定永久删除文章「${post.title}」吗？此操作无法撤销，只影响当前浏览器的本地演示数据。`);
    if (confirmed && deletePost(post.id)) {
      setSelectedIds((current) => current.filter((id) => id !== post.id));
      setRefreshKey((key) => key + 1);
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    const confirmed = window.confirm(`确定永久删除选中的 ${selectedIds.length} 篇文章吗？此操作无法撤销。`);
    if (!confirmed) return;
    const deletedIds = selectedIds.filter((id) => deletePost(id));
    setSelectedIds([]);
    setRefreshKey((key) => key + 1);
    window.alert(`已删除 ${deletedIds.length} 篇文章。`);
  };

  const togglePageSelection = (checked: boolean) => {
    setSelectedIds((current) => checked
      ? Array.from(new Set([...current, ...pageIds]))
      : current.filter((id) => !pageIds.includes(id)));
  };

  const roleLabel = (role?: string) => role === 'admin' ? '管理员' : role === 'editor' ? '编辑' : '普通用户';
  const handleToggleEditor = (item: User) => {
    if (item.role === UserRole.ADMIN) return;
    const nextRole = item.role === UserRole.EDITOR ? UserRole.USER : UserRole.EDITOR;
    if (updateUserRole(item.id, nextRole)) setRefreshKey((key) => key + 1);
  };
  const handleDeleteUser = (item: User) => {
    if (item.id === user.id || item.role === UserRole.ADMIN) return;
    const confirmed = window.confirm(`确定删除本地演示用户「${item.username}」吗？`);
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
            <div className="flex gap-2">
              <Button variant="outline" asChild><Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />返回网站</Link></Button>
              <Button asChild><Link to="/create">发布文章</Link></Button>
            </div>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">全部文章</CardTitle><FileText className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{posts.length}</div><p className="text-xs text-muted-foreground">全部状态的文章</p></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">已发布</CardTitle><Eye className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{publishedCount}</div><p className="text-xs text-muted-foreground">公开展示的文章</p></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">草稿 / 定时</CardTitle><FileText className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{draftCount} / {scheduledCount}</div><p className="text-xs text-muted-foreground">尚未公开或等待发布</p></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">用户数量</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{users.length}</div><p className="text-xs text-muted-foreground">本地演示用户记录</p></CardContent></Card>
          </div>

          <section className="mb-8 overflow-hidden rounded-xl border bg-card">
            <div className="border-b p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div><h2 className="text-lg font-semibold">文章管理</h2><p className="text-sm text-muted-foreground">使用搜索、状态筛选和分页管理全站文章；默认按最近更新排序。</p></div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => setRefreshKey((key) => key + 1)}><RefreshCw className="mr-1 h-4 w-4" />刷新</Button>
                  <Button variant="destructive" size="sm" disabled={selectedIds.length === 0} onClick={handleBulkDelete}><Trash2 className="mr-1 h-4 w-4" />批量删除（{selectedIds.length}）</Button>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-[minmax(220px,1fr)_180px_180px]">
                <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索标题、摘要、正文或标签…" className="pl-9" aria-label="搜索文章" /></div>
                <select aria-label="按文章状态筛选" value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
                  <option value="all">全部状态</option><option value="published">已发布</option><option value="draft">草稿</option><option value="scheduled">定时发布</option>
                </select>
                <select aria-label="文章排序方式" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
                  <option value="updated">最近更新</option><option value="newest">最新创建</option><option value="oldest">最早创建</option><option value="title">标题排序</option>
                </select>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-muted-foreground">快捷状态：</span>
                {(['all', 'published', 'draft', 'scheduled'] as const).map((value) => (
                  <Button key={value} size="sm" variant={status === value ? 'secondary' : 'ghost'} onClick={() => setStatus(value)}>
                    {value === 'all' ? '全部' : value === 'published' ? '已发布' : value === 'draft' ? '草稿' : '定时发布'}
                  </Button>
                ))}
              </div>
            </div>

            {posts.length === 0 ? (
              <div className="p-10 text-center text-sm text-muted-foreground">暂无文章。可以先创建一篇本地演示文章。</div>
            ) : filteredPosts.length === 0 ? (
              <div className="p-10 text-center"><p className="text-sm text-muted-foreground">没有找到符合条件的文章。</p><Button variant="outline" size="sm" className="mt-3" onClick={() => { setQuery(''); setStatus('all'); }}>清除搜索和筛选</Button></div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead className="w-10"><input type="checkbox" aria-label="选择当前页全部文章" checked={allPageSelected} onChange={(event) => togglePageSelection(event.target.checked)} /></TableHead>
                      <TableHead className="min-w-[220px]">文章标题</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>作者</TableHead>
                      <TableHead className="min-w-[140px]">分类 / 标签</TableHead>
                      <TableHead>创建时间</TableHead>
                      <TableHead>更新时间</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {pagination.items.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell><input type="checkbox" aria-label={`选择文章：${post.title}`} checked={selectedIds.includes(post.id)} onChange={(event) => setSelectedIds((current) => event.target.checked ? [...current, post.id] : current.filter((id) => id !== post.id))} /></TableCell>
                          <TableCell><div className="max-w-[360px]"><Link to={`/edit/${post.id}`} className="font-medium hover:text-primary hover:underline">{post.title || '未命名文章'}</Link><p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{post.excerpt || '暂无摘要'}</p></div></TableCell>
                          <TableCell><Badge variant={post.status === 'published' ? 'default' : 'secondary'}>{statusLabel(post.status)}</Badge></TableCell>
                          <TableCell className="whitespace-nowrap">{post.author?.username || '未知'}</TableCell>
                          <TableCell><div className="max-w-[180px]"><p className="text-sm">{post.categoryId ? categoryNames.get(post.categoryId) || '未分类' : '未分类'}</p><p className="line-clamp-1 text-xs text-muted-foreground">{(post.tags || []).slice(0, 2).map((id) => tagNames.get(id) || id).join('、') || '无标签'}</p></div></TableCell>
                          <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{formatDate(post.createdAt)}</TableCell>
                          <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{formatDate(post.updatedAt)}</TableCell>
                          <TableCell><div className="flex justify-end gap-1"><Button asChild size="sm" variant="ghost"><Link to={`/post/${post.id}`} aria-label={`查看文章：${post.title}`}>查看</Link></Button><Button asChild size="sm" variant="ghost"><Link to={`/edit/${post.id}`} aria-label={`编辑文章：${post.title}`}><Edit3 className="h-4 w-4" /></Link></Button><Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDeletePost(post)} aria-label={`删除文章：${post.title}`}><Trash2 className="h-4 w-4" /></Button></div></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">显示第 {pagination.start}–{pagination.end} 条，共 {pagination.total} 篇文章</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <label htmlFor="admin-page-size" className="text-sm text-muted-foreground">每页</label>
                    <select id="admin-page-size" value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))} className="h-9 rounded-md border border-input bg-background px-2 text-sm"><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option></select>
                    <span className="text-sm text-muted-foreground">条 · 第 {pagination.page} / {pagination.totalPages} 页</span>
                    <Button size="sm" variant="outline" disabled={pagination.page <= 1} onClick={() => setPage((current) => current - 1)}>上一页</Button>
                    <Button size="sm" variant="outline" disabled={pagination.page >= pagination.totalPages} onClick={() => setPage((current) => current + 1)}>下一页</Button>
                  </div>
                </div>
              </>
            )}
          </section>

          <section className="overflow-hidden rounded-xl border bg-card">
            <div className="border-b p-5"><h2 className="text-lg font-semibold">用户列表</h2><p className="text-sm text-muted-foreground">查看本地演示用户和角色。正式角色授权将在 Supabase RLS 阶段实现。</p></div>
            <div className="divide-y">{users.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0"><p className="truncate font-medium">{item.username}</p><p className="text-xs text-muted-foreground">{item.phone ? item.phone.slice(0, 3) + '****' + item.phone.slice(-4) : '未填写手机号'}</p></div>
                <div className="flex shrink-0 flex-wrap items-center gap-2"><Badge variant={item.role === 'admin' ? 'default' : 'secondary'}>{roleLabel(item.role)}</Badge>{item.role !== UserRole.ADMIN && <Button size="sm" variant="outline" onClick={() => handleToggleEditor(item)}>{item.role === UserRole.EDITOR ? '设为普通用户' : '设为编辑'}</Button>}{item.id !== user.id && item.role !== UserRole.ADMIN && <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(item)}>删除用户</Button>}</div>
              </div>
            ))}{users.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">暂无用户记录</p>}</div>
          </section>
          <p className="mt-6 text-xs text-muted-foreground">注意：本页面是本地体验用的管理员界面，不构成生产环境的安全权限系统。删除文章为本地永久删除且不可恢复；清理浏览器站点数据会清除演示数据。</p>
        </main>
      </AnimatedTransition>
    </>
  );
};

export default AdminDashboard;
