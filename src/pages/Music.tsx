
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AnimatedTransition from '../components/AnimatedTransition';
import Navbar from '../components/Navbar';
import { Button } from "@/components/ui/button";
import { isLoggedInToQQMusic, getQQMusicTracks } from '../lib/qqMusicService';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Play, Pause, Music as MusicIcon, User } from 'lucide-react';
import { toast } from 'sonner';

/**
 * 音乐页面组件
 * 实现QQ音乐播放功能，未登录状态下显示免费歌曲，登录后显示用户歌单
 */
const Music = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);

  /**
   * 初始化音乐播放器并检查登录状态
   */
  useEffect(() => {
    // 检查是否已登录QQ音乐
    const checkLoginStatus = async () => {
      const loggedIn = await isLoggedInToQQMusic();
      setIsLoggedIn(loggedIn);
      
      // 获取音乐列表(根据登录状态选择免费歌曲或用户歌单)
      try {
        const musicTracks = await getQQMusicTracks(loggedIn);
        setTracks(musicTracks);
      } catch (error) {
        console.error("加载音乐列表失败:", error);
        toast.error("加载音乐列表失败，请稍后再试");
      }
    };
    
    checkLoginStatus();
    
    // 创建音频元素
    const audio = new Audio();
    audio.onerror = (e) => {
      console.error("音频播放错误:", e);
      toast.error("该音乐无法播放，请尝试其他歌曲");
    };
    setAudioElement(audio);
    
    // 组件卸载时清理资源
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);

  /**
   * 跳转到QQ音乐登录页
   */
  const handleLogin = () => {
    navigate('/music/login-qq');
  };

  /**
   * 播放选中的音乐
   * @param {Object} track - 要播放的音乐对象
   */
  const playTrack = (track) => {
    if (audioElement) {
      // 停止当前播放的音乐
      audioElement.pause();
      
      // 播放新选择的音乐
      audioElement.src = track.url;
      audioElement.play()
        .catch(error => {
          console.error("播放音乐失败:", error);
          toast.error("无法播放这首歌曲，请尝试其他歌曲");
        });
      
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  /**
   * 切换播放/暂停状态
   */
  const togglePlayPause = () => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play()
          .catch(error => {
            console.error("恢复播放失败:", error);
            toast.error("恢复播放失败，请重新选择歌曲");
          });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <Navbar />
      <AnimatedTransition>
        <div className="page-container pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl md:text-4xl font-serif font-semibold">
                音乐
              </h1>
              
              {!isLoggedIn && (
                <Button onClick={handleLogin} className="bg-blue-500 hover:bg-blue-600">
                  <User className="mr-2 h-4 w-4" /> QQ音乐登录
                </Button>
              )}
            </div>
            
            {/* 当前播放器控制区域 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              {currentTrack ? (
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-10 w-10 rounded-full"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <div>
                    <h3 className="font-medium">{currentTrack.name}</h3>
                    <p className="text-sm text-gray-500">{currentTrack.artist}</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center h-20 text-gray-500">
                  <MusicIcon className="mr-2" />
                  <span>选择一首歌曲开始播放</span>
                </div>
              )}
            </div>
            
            {/* 歌曲列表区域 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <Table>
                <TableCaption>
                  {isLoggedIn ? '您的QQ音乐歌单' : '免费推荐歌曲'}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>歌曲名</TableHead>
                    <TableHead>歌手</TableHead>
                    <TableHead>专辑</TableHead>
                    <TableHead className="text-right">时长</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tracks.map((track) => (
                    <TableRow 
                      key={track.id}
                      className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        currentTrack && currentTrack.id === track.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                      }`}
                      onClick={() => playTrack(track)}
                    >
                      <TableCell>
                        {currentTrack && currentTrack.id === track.id ? (
                          isPlaying ? <Pause className="h-4 w-4 text-blue-500" /> : <Play className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Play className="h-4 w-4 text-gray-400" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{track.name}</TableCell>
                      <TableCell>{track.artist}</TableCell>
                      <TableCell>{track.album}</TableCell>
                      <TableCell className="text-right">{track.duration}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        </div>
      </AnimatedTransition>
    </>
  );
};

export default Music;
