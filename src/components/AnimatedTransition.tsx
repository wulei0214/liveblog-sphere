
/**
 * 动画过渡组件
 * 
 * 为页面和组件提供平滑的动画过渡效果
 * 基于framer-motion库实现入场和离场动画
 */

import React from 'react';
import { motion } from 'framer-motion';

// 页面过渡动画变体配置
const pageVariants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -8,
  },
};

// 过渡动画配置
const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

// 组件属性接口
interface AnimatedTransitionProps {
  children: React.ReactNode;
}

/**
 * 动画过渡包装组件
 * 为子组件添加入场和离场动画效果
 * 
 * @param children 要添加动画效果的子组件
 */
const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedTransition;
