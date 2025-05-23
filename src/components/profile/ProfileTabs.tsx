
import React from 'react';
import { BookOpen, Users, Heart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfilePosts from './ProfilePosts';
import UsersList from './UsersList';
import { User, getUserById } from '@/lib/data';

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userPosts: any[];
  user: User;
}

const ProfileTabs = ({ activeTab, setActiveTab, userPosts, user }: ProfileTabsProps) => {
  // Get following users
  const followingUsers = user.following?.map(followingId => getUserById(followingId)).filter(Boolean) || [];
  
  // Get followers
  const followerUsers = user.followers?.map(followerId => getUserById(followerId)).filter(Boolean) || [];
  
  return (
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
        <ProfilePosts posts={userPosts} />
      </TabsContent>
      
      <TabsContent value="following" className="mt-6">
        <UsersList 
          users={followingUsers as User[]} 
          emptyMessage="暂无关注的用户" 
        />
      </TabsContent>
      
      <TabsContent value="followers" className="mt-6">
        <UsersList 
          users={followerUsers as User[]} 
          emptyMessage="暂无粉丝" 
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
