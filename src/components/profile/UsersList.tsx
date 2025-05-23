
import React from 'react';
import { User } from '@/repositories/userRepository';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { getUserRoleDisplay } from './ProfileHeader';

interface UsersListProps {
  users: User[];
  emptyMessage: string;
}

const UsersList = ({ users, emptyMessage }: UsersListProps) => {
  const navigate = useNavigate();
  
  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {users.map(user => (
        <Card 
          key={user.id} 
          className="cursor-pointer hover:shadow-md transition-shadow" 
          onClick={() => navigate(`/profile/${user.id}`)}
        >
          <CardContent className="pt-6 flex items-center">
            <Avatar className="mr-4">
              <AvatarFallback>
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
              {user.avatar && <AvatarImage src={user.avatar} />}
            </Avatar>
            <div>
              <p className="font-medium">{user.username}</p>
              <p className="text-sm text-gray-500">{getUserRoleDisplay(user.role)}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UsersList;
