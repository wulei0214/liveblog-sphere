
/**
 * 弹幕组件
 * 以弹幕形式展示用户留言
 */
import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { BoardMessage } from '../../models/Message';

interface DanmakuProps {
  messages: BoardMessage[];
}

// 弹幕轨道数量
const TRACK_COUNT = 8;

// 随机生成轨道高度
const getRandomTrack = () => Math.floor(Math.random() * TRACK_COUNT);

// 随机生成动画时长 (8-15秒)
const getRandomDuration = () => Math.random() * 7 + 8;

const Danmaku: React.FC<DanmakuProps> = ({ messages }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeDanmaku, setActiveDanmaku] = useState<{
    message: BoardMessage;
    track: number;
    duration: number;
    startTime: number;
  }[]>([]);

  // 初始化和更新弹幕
  useEffect(() => {
    if (!messages.length) return;
    
    // 清除所有现有的弹幕
    setActiveDanmaku([]);
    
    // 创建新的弹幕列表
    const maxDanmaku = Math.min(messages.length, 30); // 最多显示30条弹幕
    const newDanmaku = [];
    const usedTracks = new Set<number>();
    
    for (let i = 0; i < maxDanmaku; i++) {
      // 尝试找到一个空闲的轨道
      let track;
      do {
        track = getRandomTrack();
      } while (usedTracks.has(track) && usedTracks.size < TRACK_COUNT);
      
      // 如果所有轨道都被占用，可以重用
      if (usedTracks.size >= TRACK_COUNT) {
        usedTracks.clear();
      }
      
      usedTracks.add(track);
      
      newDanmaku.push({
        message: messages[i],
        track,
        duration: getRandomDuration(),
        startTime: i * 1.2, // 错开启动时间，每个弹幕间隔1.2秒
      });
    }
    
    setActiveDanmaku(newDanmaku);
  }, [messages]);

  return (
    <div 
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
    >
      {activeDanmaku.map((item, index) => (
        <DanmakuItem
          key={`${item.message.id}-${index}`}
          item={item}
          containerWidth={containerRef.current?.clientWidth || 1000}
        />
      ))}
    </div>
  );
};

// 单个弹幕项目
interface DanmakuItemProps {
  item: {
    message: BoardMessage;
    track: number;
    duration: number;
    startTime: number;
  };
  containerWidth: number;
}

const DanmakuItem: React.FC<DanmakuItemProps> = ({ item, containerWidth }) => {
  const controls = useAnimationControls();
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // 元素宽度
    const width = elementRef.current?.offsetWidth || 200;
    
    // 设置初始位置，确保在容器之外
    controls.set({ x: containerWidth });
    
    // 等待指定时间后开始动画
    const timeoutId = setTimeout(() => {
      controls.start({
        x: -width - 50, // 移动到容器外部左侧
        transition: {
          duration: item.duration,
          ease: "linear",
        },
      });
    }, item.startTime * 1000);
    
    return () => clearTimeout(timeoutId);
  }, [containerWidth, controls, item.duration, item.startTime]);

  return (
    <motion.div
      ref={elementRef}
      animate={controls}
      className="absolute whitespace-nowrap px-2 py-1 rounded"
      style={{
        top: `${(item.track * (100 / TRACK_COUNT)) + 2}%`,
        color: item.message.color || "#ffffff",
        textShadow: "0px 0px 4px rgba(0, 0, 0, 0.8)",
        fontSize: "1rem",
        fontWeight: "500",
        zIndex: 10,
      }}
    >
      {item.message.content} 【{item.message.author.username}】
    </motion.div>
  );
};

export default Danmaku;
