
import React from 'react';
import { motion } from 'framer-motion';
import { User } from '@/repositories/userRepository';
import { Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserRole } from '@/repositories/user/types';

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  isUserFollowing: boolean;
  onFollowToggle: () => void;
  onEditClick: () => void;
  formattedJoinDate: string;
}

// 辅助函数，获取用户角色显示文本
export const getUserRoleDisplay = (role: string | UserRole | undefined) => {
  if (role === UserRole.ADMIN || role === 'admin') {
    return '管理员';
  } else if (role === UserRole.EDITOR || role === 'editor') {
    return '编辑';
  } else {
    return '用户';
  }
};

const ProfileHeader = ({ 
  user, 
  isOwnProfile, 
  isUserFollowing, 
  onFollowToggle, 
  onEditClick,
  formattedJoinDate
}: ProfileHeaderProps) => {
  return (
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
              onClick={onEditClick}
            >
              <span className="mr-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </span>
              编辑资料
            </Button>
          ) : (
            <Button
              variant={isUserFollowing ? "outline" : "default"}
              size="sm"
              className="flex items-center"
              onClick={onFollowToggle}
            >
              <span className="mr-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </span>
              {isUserFollowing ? '已关注' : '关注'}
            </Button>
          )}
        </div>
        <CardTitle className="mt-4 flex items-center">
          {user.username}
          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            {getUserRoleDisplay(user.role)}
          </span>
        </CardTitle>
        <CardDescription className="flex items-center mt-1">
          <Calendar size={14} className="mr-1" />
          加入于 {formattedJoinDate}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default ProfileHeader;
