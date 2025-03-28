
import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Music, Play, Heart, SkipForward, Shuffle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

/**
 * 网易云音乐风格的嵌入式播放器组件
 * 提供类似网易云音乐的播放界面和交互体验
 */
const MusicEmbed = () => {
  // 歌曲列表数据
  const [songs, setSongs] = useState([
    {
      id: 1,
      title: "起风了",
      artist: "买辣椒也用券",
      album: "起风了",
      cover: "https://via.placeholder.com/80",
      duration: "05:23",
      plays: 1543788
    },
    {
      id: 2,
      title: "可能",
      artist: "程响",
      album: "可能",
      cover: "https://via.placeholder.com/80",
      duration: "04:15",
      plays: 987621
    },
    {
      id: 3,
      title: "星辰大海",
      artist: "黄霄雲",
      album: "星辰大海",
      cover: "https://via.placeholder.com/80",
      duration: "04:49",
      plays: 876543
    },
    {
      id: 4,
      title: "大鱼",
      artist: "周深",
      album: "大鱼",
      cover: "https://via.placeholder.com/80",
      duration: "04:47",
      plays: 1256432
    },
    {
      id: 5,
      title: "夜的第七章",
      artist: "周杰伦/潘儿",
      album: "依然范特西",
      cover: "https://via.placeholder.com/80",
      duration: "03:54",
      plays: 1654398
    },
    {
      id: 6,
      title: "花海",
      artist: "周杰伦",
      album: "魔杰座",
      cover: "https://via.placeholder.com/80",
      duration: "04:24",
      plays: 1428765
    },
    {
      id: 7,
      title: "光年之外",
      artist: "邓紫棋",
      album: "光年之外",
      cover: "https://via.placeholder.com/80",
      duration: "03:56",
      plays: 1321654
    },
    {
      id: 8,
      title: "平凡之路",
      artist: "朴树",
      album: "猎户星座",
      cover: "https://via.placeholder.com/80",
      duration: "05:21",
      plays: 1678942
    },
    {
      id: 9,
      title: "天下",
      artist: "张杰",
      album: "明天过后",
      cover: "https://via.placeholder.com/80",
      duration: "04:17",
      plays: 987543
    },
    {
      id: 10,
      title: "我们都一样",
      artist: "张杰",
      album: "爱，不解释",
      cover: "https://via.placeholder.com/80",
      duration: "04:22",
      plays: 876543
    }
  ]);
  
  const [currentSong, setCurrentSong] = useState(null);

  /**
   * 格式化播放次数
   * @param {number} plays - 播放次数
   * @returns {string} 格式化后的播放次数
   */
  const formatPlays = (plays) => {
    if (plays >= 10000) {
      return (plays / 10000).toFixed(1) + '万';
    }
    return plays.toString();
  };

  /**
   * 播放选中的歌曲
   * @param {number} id - 歌曲ID
   */
  const handlePlaySong = (id) => {
    setCurrentSong(id);
    toast.success("开始播放", { duration: 2000 });
  };

  return (
    <div className="w-full h-full min-h-[80vh] py-4">
      {/* 头部标题 */}
      <div className="flex items-center mb-4">
        <Music className="mr-2 text-red-500" />
        <h2 className="text-xl font-serif font-semibold">网易云音乐热门</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 左侧歌曲列表 */}
        <div className="w-full lg:w-2/3">
          <ScrollArea className="h-[calc(100vh-250px)] w-full pr-4">
            <div className="space-y-2">
              {songs.map((song) => (
                <div 
                  key={song.id}
                  className={`flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${currentSong === song.id ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                >
                  <div className="w-12 h-12 rounded overflow-hidden mr-4 flex-shrink-0">
                    <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-base truncate">{song.title}</h3>
                      <span className="text-gray-500 text-sm">{song.duration}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-500 text-sm truncate">{song.artist} - {song.album}</p>
                      <span className="text-gray-500 text-xs">{formatPlays(song.plays)}播放</span>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center space-x-3">
                    <button 
                      onClick={() => handlePlaySong(song.id)}
                      className={`p-2 rounded-full ${currentSong === song.id ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    >
                      <Play size={18} />
                    </button>
                    <button 
                      className="p-2 rounded-full text-gray-500 hover:text-red-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => toast.success("已添加到我喜欢的音乐", { duration: 2000 })}
                    >
                      <Heart size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* 右侧推荐歌单 */}
        <div className="w-full lg:w-1/3 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">推荐歌单</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-700 p-3 rounded-lg hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-200 dark:bg-gray-600 rounded-md mb-2 overflow-hidden">
                <img src="https://via.placeholder.com/150" alt="Playlist" className="w-full h-full object-cover rounded-md hover:scale-105 transition-transform" />
              </div>
              <p className="text-sm font-medium line-clamp-2">华语经典 - 那些触动你心的歌曲</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-3 rounded-lg hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-200 dark:bg-gray-600 rounded-md mb-2 overflow-hidden">
                <img src="https://via.placeholder.com/150" alt="Playlist" className="w-full h-full object-cover rounded-md hover:scale-105 transition-transform" />
              </div>
              <p className="text-sm font-medium line-clamp-2">流行热歌 - 最新热门单曲</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-3 rounded-lg hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-200 dark:bg-gray-600 rounded-md mb-2 overflow-hidden">
                <img src="https://via.placeholder.com/150" alt="Playlist" className="w-full h-full object-cover rounded-md hover:scale-105 transition-transform" />
              </div>
              <p className="text-sm font-medium line-clamp-2">轻音乐 - 工作学习好伙伴</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-3 rounded-lg hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-200 dark:bg-gray-600 rounded-md mb-2 overflow-hidden">
                <img src="https://via.placeholder.com/150" alt="Playlist" className="w-full h-full object-cover rounded-md hover:scale-105 transition-transform" />
              </div>
              <p className="text-sm font-medium line-clamp-2">怀旧金曲 - 经典老歌回忆</p>
            </div>
          </div>
        </div>
      </div>

      {/* 底部播放栏 */}
      {currentSong !== null && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-3 shadow-lg z-30">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded overflow-hidden mr-3">
                <img src={songs[currentSong - 1].cover} alt={songs[currentSong - 1].title} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-medium text-sm">{songs[currentSong - 1].title}</p>
                <p className="text-gray-500 text-xs">{songs[currentSong - 1].artist}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full text-gray-500 hover:text-red-500">
                <Shuffle size={18} />
              </button>
              <button className="p-2 rounded-full text-red-500 bg-red-50 dark:bg-red-900/20">
                <Play size={20} />
              </button>
              <button className="p-2 rounded-full text-gray-500 hover:text-red-500">
                <SkipForward size={18} />
              </button>
            </div>
            <div className="text-sm text-gray-500">
              <span>00:00</span>
              <span> / </span>
              <span>{songs[currentSong - 1].duration}</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4 text-center">
        <a 
          href="https://music.163.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-red-500 hover:underline"
        >
          进入网易云音乐 <ExternalLink size={14} className="ml-1" />
        </a>
      </div>
    </div>
  );
};

export default MusicEmbed;
