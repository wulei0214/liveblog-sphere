
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AnimatedTransition from '../components/AnimatedTransition';
import Navbar from '../components/Navbar';
import { Button } from "@/components/ui/button";
import { isLoggedInToQQMusic, loginToQQMusic, getQQMusicTracks } from '../lib/qqMusicService';
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

const Music = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);

  useEffect(() => {
    // Check if user is logged in to QQ Music
    const checkLoginStatus = async () => {
      const loggedIn = await isLoggedInToQQMusic();
      setIsLoggedIn(loggedIn);
      
      // Get tracks (either free ones or user's playlist based on login status)
      const musicTracks = await getQQMusicTracks(loggedIn);
      setTracks(musicTracks);
    };
    
    checkLoginStatus();
    
    // Create audio element
    const audio = new Audio();
    setAudioElement(audio);
    
    // Cleanup
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);

  const handleLogin = () => {
    navigate('/music/login-qq');
  };

  const playTrack = (track) => {
    if (audioElement) {
      // Stop current track if playing
      audioElement.pause();
      
      // Play new track
      audioElement.src = track.url;
      audioElement.play();
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
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
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <Table>
                <TableCaption>
                  {isLoggedIn ? '您的QQ音乐歌单' : '随机推荐歌曲'}
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
