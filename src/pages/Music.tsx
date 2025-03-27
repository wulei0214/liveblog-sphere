
import React from 'react';
import { motion } from 'framer-motion';
import AnimatedTransition from '../components/AnimatedTransition';
import Navbar from '../components/Navbar';
import MusicEmbed from '../components/MusicEmbed';

const Music = () => {
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
            <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-8 text-center">
              音乐
            </h1>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <MusicEmbed />
            </div>
          </motion.div>
        </div>
      </AnimatedTransition>
    </>
  );
};

export default Music;
