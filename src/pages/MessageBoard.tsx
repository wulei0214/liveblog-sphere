
/**
 * 留言板页面
 * 展示用户留言和弹幕功能
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Send, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import AnimatedTransition from '../components/AnimatedTransition';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from '../contexts/AuthContext';
import { getAllBoardMessages, addBoardMessage, deleteBoardMessage } from '../repositories/messageBoardRepository';
import { BoardMessage } from '../models/Message';
import Danmaku from '../components/message-board/Danmaku';

const MessageBoard = () => {
  const [messages, setMessages] = useState<BoardMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [messageType, setMessageType] = useState<'normal' | 'danmaku'>('normal');
  const [messageColor, setMessageColor] = useState('#ffffff');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, isAdminUser } = useAuth();
  
  // 获取所有留言
  const fetchMessages = () => {
    const allMessages = getAllBoardMessages();
    setMessages(allMessages);
  };
  
  useEffect(() => {
    fetchMessages();
    // 每10秒刷新一次数据
    const intervalId = setInterval(fetchMessages, 10000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // 发布新留言
  const handleSubmitMessage = () => {
    if (!isAuthenticated) {
      toast.error('请先登录后再发布留言');
      return;
    }
    
    if (!messageInput.trim()) {
      toast.error('留言内容不能为空');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newMessage = addBoardMessage(
        messageInput.trim(),
        messageType,
        messageType === 'danmaku' ? messageColor : undefined
      );
      
      if (newMessage) {
        toast.success('留言已发布');
        setMessageInput('');
        fetchMessages(); // 刷新消息列表
      }
    } catch (error) {
      toast.error('留言发布失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 删除留言
  const handleDeleteMessage = (messageId: string) => {
    if (deleteBoardMessage(messageId)) {
      toast.success('留言已删除');
      fetchMessages(); // 刷新消息列表
    }
  };
  
  // 预览色彩选择
  const colorOptions = [
    { value: '#ffffff', label: '白色' },
    { value: '#ff6b6b', label: '红色' },
    { value: '#4ecdc4', label: '青色' },
    { value: '#ffe66d', label: '黄色' },
    { value: '#61c0bf', label: '蓝色' },
    { value: '#ff8484', label: '粉色' },
    { value: '#a0c4ff', label: '淡蓝' },
    { value: '#ffd166', label: '橙色' },
  ];
  
  return (
    <>
      <Navbar />
      <AnimatedTransition>
        <div className="min-h-screen pt-20 pb-10">
          {/* 弹幕区域 */}
          <div className="relative h-52 bg-gray-900 mb-8 overflow-hidden">
            <Danmaku messages={messages.filter(msg => msg.type === 'danmaku')} />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/80 pointer-events-none"></div>
          </div>
          
          <div className="max-w-4xl mx-auto px-4">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold">留言板</h1>
              </div>
              
              {/* 留言输入框 */}
              <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
                <Textarea
                  placeholder={isAuthenticated ? "写下你的留言..." : "请先登录后再留言"}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="w-full mb-4"
                  rows={3}
                  disabled={!isAuthenticated}
                />
                
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex items-center">
                    <RadioGroup 
                      value={messageType} 
                      onValueChange={(value) => setMessageType(value as 'normal' | 'danmaku')}
                      className="flex items-center space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="normal" id="normal" />
                        <Label htmlFor="normal">普通留言</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="danmaku" id="danmaku" />
                        <Label htmlFor="danmaku">弹幕</Label>
                      </div>
                    </RadioGroup>
                    
                    {messageType === 'danmaku' && (
                      <div className="ml-4 flex items-center gap-2">
                        <Label htmlFor="color" className="whitespace-nowrap">颜色:</Label>
                        <select
                          id="color"
                          value={messageColor}
                          onChange={(e) => setMessageColor(e.target.value)}
                          className="rounded-md border border-input bg-background px-3 py-1 text-sm"
                          style={{ color: messageColor }}
                        >
                          {colorOptions.map((color) => (
                            <option 
                              key={color.value} 
                              value={color.value}
                              style={{ color: color.value }}
                            >
                              {color.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={handleSubmitMessage}
                    disabled={!isAuthenticated || isSubmitting}
                    className="flex items-center"
                  >
                    <Send size={16} className="mr-2" />
                    {isSubmitting ? '发布中...' : '发布留言'}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* 留言列表 */}
            <div className="space-y-4">
              {messages.filter(msg => msg.type === 'normal').map((message) => {
                const messageDate = new Date(message.createdAt).toLocaleString('zh-CN');
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-card border border-border rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {message.author.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{message.author.username}</p>
                            <p className="text-xs text-muted-foreground">{messageDate}</p>
                          </div>
                          {isAdminUser && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                              onClick={() => handleDeleteMessage(message.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          )}
                        </div>
                        <p className="mt-2">{message.content}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              
              {messages.filter(msg => msg.type === 'normal').length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  暂无留言，来发表第一条留言吧！
                </div>
              )}
            </div>
          </div>
        </div>
      </AnimatedTransition>
    </>
  );
};

export default MessageBoard;
