import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { loginUser } from '@/repositories/userRepository';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user?.role === 'admin') navigate('/admin');
  }, [isLoading, user, navigate]);

  if (!import.meta.env.DEV) return <Navigate to="/login" replace />;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const admin = loginUser('admin', password);
      if (!admin) {
        toast({ title: '登录失败', description: '管理员密码不正确', variant: 'destructive' });
        return;
      }
      toast({ title: '管理员登录成功', description: '当前是本地演示模式，不连接云端数据库。' });
      navigate('/admin');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <AnimatedTransition>
        <main className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
          <section className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"><ShieldCheck className="h-6 w-6 text-primary" /></div>
              <h1 className="text-2xl font-semibold">管理员演示登录</h1>
              <p className="mt-2 text-sm text-muted-foreground">仅限本机开发体验，不是正式管理员认证。</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label htmlFor="admin-username">账号</Label><Input id="admin-username" value="admin" readOnly /></div>
              <div className="space-y-2"><Label htmlFor="admin-password">演示密码</Label><Input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="请输入管理员演示密码" autoComplete="current-password" required /></div>
              <div className="rounded-md bg-muted/60 p-3 text-sm"><p className="font-medium">本地演示密码</p><p className="font-mono">AdminDemo@123</p></div>
              <Button type="submit" className="w-full" disabled={submitting || !password}>{submitting ? '登录中...' : '进入管理后台'}</Button>
            </form>
            <div className="mt-5 text-center"><Link to="/login" className="inline-flex items-center text-sm text-primary hover:underline"><ArrowLeft className="mr-1 h-4 w-4" />返回身份选择</Link></div>
          </section>
        </main>
      </AnimatedTransition>
    </>
  );
};

export default AdminLogin;
