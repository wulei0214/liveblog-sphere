
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AnimatedTransition from '../components/AnimatedTransition';
import Navbar from '../components/Navbar';
import { useToast } from '../hooks/use-toast';
import { UserRole, getAllUsers } from '../lib/auth';
import { getAllPosts } from '../lib/data';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, FileText, BarChart, Calendar } from 'lucide-react';

/**
 * 管理后台页面
 * 展示用户统计、文章统计等数据
 */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdminUser, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  // 加载用户和文章数据
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!isAdminUser) {
      navigate('/');
      toast({
        title: "访问受限",
        description: "只有管理员可以访问管理后台",
        variant: "destructive",
      });
      return;
    }
    
    const loadData = () => {
      try {
        const allUsers = getAllUsers();
        const allPosts = getAllPosts();
        setUsers(allUsers);
        setPosts(allPosts);
      } catch (error) {
        console.error('加载数据失败:', error);
        toast({
          title: "数据加载失败",
          description: "无法加载管理数据，请稍后再试",
          variant: "destructive",
        });
      }
    };
    
    loadData();
  }, [isAuthenticated, isAdminUser, navigate, toast]);

  // 统计数据
  const totalUsers = users.length;
  const totalPosts = posts.length;
  const totalComments = posts.reduce((acc, post) => acc + post.comments.length, 0);
  const usersByRole = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // 计算最近30天的新用户数
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newUsers = users.filter(user => new Date(user.createdAt) > thirtyDaysAgo).length;
  
  return (
    <>
      <Navbar />
      <AnimatedTransition>
        <div className="page-container pt-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <BarChart className="h-6 w-6" />
                管理后台
              </h1>
            </div>
            
            <Tabs
              defaultValue="overview"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="overview" className="flex items-center gap-1">
                  <BarChart className="h-4 w-4" />
                  <span>概览</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>用户管理</span>
                </TabsTrigger>
                <TabsTrigger value="posts" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>文章管理</span>
                </TabsTrigger>
              </TabsList>
              
              {/* 概览选项卡 */}
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        总用户数
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalUsers}</div>
                      <p className="text-xs text-muted-foreground">
                        最近30天新增 {newUsers} 用户
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        文章总数
                      </CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalPosts}</div>
                      <p className="text-xs text-muted-foreground">
                        平均每个用户 {(totalPosts / (totalUsers || 1)).toFixed(1)} 篇
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        评论总数
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalComments}</div>
                      <p className="text-xs text-muted-foreground">
                        平均每篇文章 {(totalComments / (totalPosts || 1)).toFixed(1)} 条
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        用户类型分布
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span>管理员:</span>
                          <span className="font-bold">{usersByRole[UserRole.ADMIN] || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>普通用户:</span>
                          <span className="font-bold">{usersByRole[UserRole.USER] || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* 用户管理选项卡 */}
              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <CardTitle>用户列表</CardTitle>
                    <CardDescription>
                      系统中所有注册用户的信息
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableCaption>共 {users.length} 名用户</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>用户名</TableHead>
                          <TableHead>角色</TableHead>
                          <TableHead>注册时间</TableHead>
                          <TableHead>文章数</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => {
                          const userPosts = posts.filter(post => post.authorId === user.id);
                          return (
                            <TableRow key={user.id}>
                              <TableCell className="font-mono">{user.id}</TableCell>
                              <TableCell>{user.username}</TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  user.role === UserRole.ADMIN 
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
                                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                }`}>
                                  {user.role}
                                </span>
                              </TableCell>
                              <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell>{userPosts.length}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* 文章管理选项卡 */}
              <TabsContent value="posts">
                <Card>
                  <CardHeader>
                    <CardTitle>文章列表</CardTitle>
                    <CardDescription>
                      系统中所有发布的文章
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableCaption>共 {posts.length} 篇文章</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>标题</TableHead>
                          <TableHead>作者</TableHead>
                          <TableHead>发布日期</TableHead>
                          <TableHead>评论数</TableHead>
                          <TableHead>URL</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {posts.map((post) => (
                          <TableRow key={post.id}>
                            <TableCell className="font-mono">{post.id}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{post.title}</TableCell>
                            <TableCell>{post.authorName}</TableCell>
                            <TableCell>{post.date}</TableCell>
                            <TableCell>{post.comments.length}</TableCell>
                            <TableCell>
                              <a 
                                href={`/post/${post.id}`}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline text-sm"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                查看
                              </a>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </AnimatedTransition>
    </>
  );
};

export default AdminDashboard;
