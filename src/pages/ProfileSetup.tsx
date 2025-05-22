
/**
 * 用户资料设置页面
 * 
 * 提供用户注册/登录后的资料完善功能
 * 包含昵称、生日、个性签名、头像设置
 */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedTransition from '@/components/AnimatedTransition';
import ProfileSetupHeader from '@/components/profile/ProfileSetupHeader';
import ProfileSetupForm from '@/components/profile/ProfileSetupForm';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { user, supabaseUser } = useAuth();
  
  // 如果用户未登录，重定向到登录页
  useEffect(() => {
    if (!supabaseUser) {
      navigate('/auth-phone');
    } else if (
      user &&
      user.username && 
      !user.username.match(/^\+?86?\d{11}$/) && 
      user.bio && 
      user.avatar
    ) {
      // 如果用户已完善资料，跳转到首页
      navigate('/');
    }
  }, [user, supabaseUser, navigate]);

  // 跳过资料设置
  const handleSkip = () => {
    navigate('/');
  };
  
  // 如果用户未登录，显示加载状态
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">正在加载...</div>;
  }
  
  return (
    <AnimatedTransition>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <ProfileSetupHeader 
            title="设置个人资料" 
            description="完善您的个人信息，让其他用户更好地了解您"
          />
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <ProfileSetupForm onSkip={handleSkip} />
          </div>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default ProfileSetup;
