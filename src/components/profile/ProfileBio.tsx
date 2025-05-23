
import React from 'react';
import { User } from '@/repositories/userRepository';
import { Mail, Phone } from 'lucide-react';
import { CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ProfileBioProps {
  user: User;
  postCount: number;
  onTabChange: (tab: string) => void;
}

const ProfileBio = ({ user, postCount, onTabChange }: ProfileBioProps) => {
  return (
    <>
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
            <p className="text-lg font-semibold">{postCount}</p>
          </div>
          <div className="text-center cursor-pointer" onClick={() => onTabChange('following')}>
            <p className="text-sm text-gray-500">关注</p>
            <p className="text-lg font-semibold">{user.following?.length || 0}</p>
          </div>
          <div className="text-center cursor-pointer" onClick={() => onTabChange('followers')}>
            <p className="text-sm text-gray-500">粉丝</p>
            <p className="text-lg font-semibold">{user.followers?.length || 0}</p>
          </div>
        </div>
      </CardFooter>
    </>
  );
};

export default ProfileBio;
