
import React from 'react';

interface ProfileSetupHeaderProps {
  title: string;
  description: string;
}

const ProfileSetupHeader = ({ title, description }: ProfileSetupHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </div>
  );
};

export default ProfileSetupHeader;
