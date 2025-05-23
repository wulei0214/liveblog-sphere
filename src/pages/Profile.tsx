
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedTransition from '../components/AnimatedTransition';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { getUserById, getPostsByUser, followUser, unfollowUser, isFollowing, updateUser, User } from '../lib/data';
import { toast } from 'sonner';
import ProfileEditDialog from '../components/ProfileEditDialog';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileBio from '../components/profile/ProfileBio';
import ProfileTabs from '../components/profile/ProfileTabs';
import NotFoundProfile from '../components/profile/NotFoundProfile';

const Profile = () => {
  const { id } = useParams<{ id: string }>();
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
    return <NotFoundProfile />;
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
            <ProfileHeader
              user={user}
              isOwnProfile={isOwnProfile}
              isUserFollowing={isUserFollowing}
              onFollowToggle={handleFollowToggle}
              onEditClick={() => setIsEditDialogOpen(true)}
              formattedJoinDate={formattedJoinDate}
            />
            
            <ProfileBio 
              user={user}
              postCount={userPosts.length}
              onTabChange={setActiveTab}
            />
            
            <ProfileTabs 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              userPosts={userPosts}
              user={user}
            />
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
