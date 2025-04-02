import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedTransition from '../components/AnimatedTransition';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { getUserById, getPostsByUser, followUser, unfollowUser, isFollowing, updateUser, User } from '../lib/data';
import { Calendar, UserRound, Edit, Settings, Users, Mail, Phone, BookOpen, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from 'sonner';
import PostCard from '../components/PostCard';
import ProfileEditDialog from '../components/ProfileEditDialog';

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [isUserFollowing, setIsUserFollowing] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  const isOwnProfile = currentUser && id === currentUser.id;

  useEffect(() => {
    if (id) {
      const userData = getUserById(id);
      setUser(userData);
      
      const posts = getPostsByUser(id);
      setUserPosts(posts);
      
      if (currentUser && id !== currentUser.id) {
        setIsUserFollowing(isFollowing(id));
      }
    }
  }, [id, currentUser]);

  const handleFollowToggle = () => {
    if (!isAuthenticated) {
      toast.error('请先登录后再关注');
      return;
    }

    if (!id) return;

    if (isUserFollowing) {
      if (unfollowUser(id)) {
        setIsUserFollowing(false);
        toast.success('已取消关注');
      }
    } else {
      if (followUser(id)) {
        setIsUserFollowing(true);
        toast.success('关注成功');
      }
    }
  };

  const handleProfileUpdate = (updatedData: any) => {
    if (!currentUser || !id) return;
    
    try {
      const updatedUser = updateUser(id, updatedData);
      if (updatedUser) {
        setUser(updatedUser);
        toast.success('个人资料已更新');
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('更新个人资料失败');
      }
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <Alert className="mt-8">
            <AlertDescription>用户不存在或已被删除</AlertDescription>
          </Alert>
          <Button className="mt-4" onClick={() => navigate('/')}>返回首页</Button>
        </div>
      </>
    );
  }

  const formattedJoinDate = new Date(user.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <Navbar />
      <AnimatedTransition>
        <div className="container mx-auto px-4 pt-24 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-8">
              <CardHeader className="relative pb-0">
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-lg"></div>
                <div className="relative pt-20 flex justify-between items-end">
                  <Avatar className="w-24 h-24 border-4 border-background">
                    <AvatarFallback className="text-2xl bg-primary/10">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                    {user.avatar && <AvatarImage src={user.avatar} alt={user.username} />}
                  </Avatar>
                  {isOwnProfile ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center"
                      onClick={() => setIsEditDialogOpen(true)}
                    >
                      <Edit size={16} className="mr-1" />
                      编辑资料
                    </Button>
                  ) : (
                    <Button
                      variant={isUserFollowing ? "outline" : "default"}
                      size="sm"
                      className="flex items-center"
                      onClick={handleFollowToggle}
                    >
                      <Users size={16} className="mr-1" />
                      {isUserFollowing ? '已关注' : '关注'}
                    </Button>
                  )}
                </div>
                <CardTitle className="mt-4 flex items-center">
                  {user.username}
                  <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {user.role === 'admin' ? '管理员' : user.role === 'editor' ? '编辑' : '用户'}
                  </span>
                </CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <Calendar size={14} className="mr-1" />
                  加入于 {formattedJoinDate}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">个人简介</p>
                  <p className="mt-1">{user.bio || '这个人很懒，还没有填写个人简介'}</p>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.email && (
                    <div className="flex items-center text-sm">
                      <Mail size={14} className="mr-2 text-gray-500" />
                      <span>{user.email}</span>
                    </div>
                  )}
                  {user.phone && (
                    <div className="flex items-center text-sm">
                      <Phone size={14} className="mr-2 text-gray-500" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex justify-between w-full">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">文章</p>
                    <p className="text-lg font-semibold">{userPosts.length}</p>
                  </div>
                  <div className="text-center cursor-pointer" onClick={() => setActiveTab('following')}>
                    <p className="text-sm text-gray-500">关注</p>
                    <p className="text-lg font-semibold">{user.following?.length || 0}</p>
                  </div>
                  <div className="text-center cursor-pointer" onClick={() => setActiveTab('followers')}>
                    <p className="text-sm text-gray-500">粉丝</p>
                    <p className="text-lg font-semibold">{user.followers?.length || 0}</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="posts" className="flex items-center">
                  <BookOpen size={16} className="mr-2" />
                  文章
                </TabsTrigger>
                <TabsTrigger value="following" className="flex items-center">
                  <Users size={16} className="mr-2" />
                  关注
                </TabsTrigger>
                <TabsTrigger value="followers" className="flex items-center">
                  <Heart size={16} className="mr-2" />
                  粉丝
                </TabsTrigger>
              </TabsList>
              <TabsContent value="posts" className="mt-6">
                {userPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userPosts.map((post, index) => (
                      <PostCard key={post.id} post={post} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">暂无文章</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="following" className="mt-6">
                {user.following && user.following.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {user.following.map(followingId => {
                      const followingUser = getUserById(followingId);
                      if (!followingUser) return null;
                      
                      return (
                        <Card key={followingId} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/profile/${followingId}`)}>
                          <CardContent className="pt-6 flex items-center">
                            <Avatar className="mr-4">
                              <AvatarFallback>
                                {followingUser.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                              {followingUser.avatar && <AvatarImage src={followingUser.avatar} />}
                            </Avatar>
                            <div>
                              <p className="font-medium">{followingUser.username}</p>
                              <p className="text-sm text-gray-500">{followingUser.role === 'admin' ? '管理员' : followingUser.role === 'editor' ? '编辑' : '用户'}</p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">暂无关注的用户</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="followers" className="mt-6">
                {user.followers && user.followers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {user.followers.map(followerId => {
                      const followerUser = getUserById(followerId);
                      if (!followerUser) return null;
                      
                      return (
                        <Card key={followerId} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/profile/${followerId}`)}>
                          <CardContent className="pt-6 flex items-center">
                            <Avatar className="mr-4">
                              <AvatarFallback>
                                {followerUser.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                              {followerUser.avatar && <AvatarImage src={followerUser.avatar} />}
                            </Avatar>
                            <div>
                              <p className="font-medium">{followerUser.username}</p>
                              <p className="text-sm text-gray-500">{followerUser.role === 'admin' ? '管理员' : followerUser.role === 'editor' ? '编辑' : '用户'}</p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">暂无粉丝</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </AnimatedTransition>
      <ProfileEditDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen}
        user={user}
        onSave={handleProfileUpdate}
      />
    </>
  );
};

export default Profile;
