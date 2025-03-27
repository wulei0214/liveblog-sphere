
import React from 'react';
import { motion } from 'framer-motion';
import AnimatedTransition from '../components/AnimatedTransition';
import Navbar from '../components/Navbar';

const Heard = () => {
  return (
    <>
      <Navbar />
      <AnimatedTransition>
        <div className="page-container pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-8 text-center">
              听到
            </h1>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <p className="text-lg text-center text-gray-600 dark:text-gray-300">
                欢迎来到听到页面，这里将为您展示精彩的音频内容。
              </p>
              <div className="mt-8 flex justify-center">
                <div className="w-full max-w-md p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    敬请期待更多内容...
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatedTransition>
    </>
  );
};

export default Heard;
