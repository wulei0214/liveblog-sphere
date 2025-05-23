
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Navbar from '../Navbar';

const NotFoundProfile = () => {
  const navigate = useNavigate();
  
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
};

export default NotFoundProfile;
