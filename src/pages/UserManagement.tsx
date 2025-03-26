
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserType, getAllUsers, deleteUser, UserRole } from '../lib/auth';
import { useAuth } from '../contexts/AuthContext';
import AnimatedTransition from '../components/AnimatedTransition';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { User, Trash2, ShieldAlert } from 'lucide-react';

const UserManagement = () => {
  const navigate = useNavigate();
  const { isAdminUser, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<UserType[]>([]);
  const { toast } = useToast();
  
  // 加载用户列表
  const loadUsers = () => {
    const allUsers = getAllUsers();
    setUsers(allUsers);
  };
  
  // 删除用户
  const handleDeleteUser = (userId: string) => {
    // 确认删除
    if (window.confirm('确定要删除此用户吗？此操作不可恢复！')) {
      const success = deleteUser(userId);
      if (success) {
        toast({
          title: "删除成功",
          description: "已成功删除该用户",
        });
        loadUsers(); // 重新加载用户列表
      } else {
        toast({
          title: "删除失败",
          description: "没有权限或用户不存在",
          variant: "destructive",
        });
      }
    }
  };
  
  // 检查权限和加载数据
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!isAdminUser) {
      navigate('/');
      toast({
        title: "访问受限",
        description: "只有管理员可以访问此页面",
        variant: "destructive",
      });
      return;
    }
    
    loadUsers();
  }, [isAuthenticated, isAdminUser, navigate]);
  
  return (
    <>
      <Navbar />
      <AnimatedTransition>
        <div className="page-container pt-24">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <User className="h-6 w-6" />
                用户管理
              </h1>
            </div>
            
            {users.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        用户名
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        角色
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        创建日期
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {user.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === UserRole.ADMIN 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          }`}>
                            {user.role === UserRole.ADMIN && <ShieldAlert className="h-3 w-3" />}
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {user.role !== UserRole.ADMIN && (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="flex items-center gap-1"
                            >
                              <Trash2 className="h-4 w-4" />
                              删除
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
                <p className="text-gray-500 dark:text-gray-400">暂无用户数据</p>
              </div>
            )}
          </div>
        </div>
      </AnimatedTransition>
    </>
  );
};

export default UserManagement;
