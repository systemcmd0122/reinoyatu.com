'use client'

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaYoutube, FaExpand, FaCompress, FaSync } from 'react-icons/fa';

const YOUTUBE_API_KEY = 'AIzaSyCZbk49tTvV6sgnbMOMCwDbQWG28NfEroY';
const CHANNEL_ID = 'UCtyQAbekyVA-pY0J0gPhyRw';


const YouTubeStats = () => {
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [previousCount, setPreviousCount] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isRealTimeUpdate, setIsRealTimeUpdate] = useState(true);
  const [latestVideoId, setLatestVideoId] = useState('');

  const fetchSubscriberCount = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
      );
      const newCount = parseInt(response.data.items[0].statistics.subscriberCount);
      setPreviousCount(subscriberCount);
      setSubscriberCount(newCount);
    } catch (error) {
      console.error('Error fetching subscriber count:', error);
    }
  }, [subscriberCount]);

  const fetchLatestVideo = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&type=video&order=date&maxResults=1&key=${YOUTUBE_API_KEY}`
      );
      setLatestVideoId(response.data.items[0].id.videoId);
    } catch (error) {
      console.error('Error fetching latest video:', error);
    }
  }, []);

  useEffect(() => {
    fetchSubscriberCount();
    fetchLatestVideo();
  }, [fetchSubscriberCount, fetchLatestVideo]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRealTimeUpdate) {
      interval = setInterval(fetchSubscriberCount, 60000); // Update every minute
    }
    return () => clearInterval(interval);
  }, [isRealTimeUpdate, fetchSubscriberCount]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="background-image" style={{
        backgroundImage: `url(https://img.youtube.com/vi/${latestVideoId}/maxresdefault.jpg)`,
        filter: 'blur(5px)',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
      }}></div>
      
      {!isFullScreen && (
        <nav className="w-full p-4 navbar text-white flex justify-between items-center slide-down">
          <div className="flex items-center space-x-2">
            <motion.img 
              src="/icon.png" 
              alt="Icon" 
              className="h-8 w-8 floating-block"
              whileHover={{ scale: 1.1 }}
            />
            <div className="text-lg font-bold minecraft-font">例のやつ：YouTube Stats</div>
          </div>
          <div className="flex space-x-4 minecraft-font">
            <Link href="/" className="minecraft-button">
              <span>Home</span>
            </Link>
            <Link href="/about" className="minecraft-button">
              <span>About</span>
            </Link>
            <Link href="/contact" className="minecraft-button">
              <span>Contact</span>
            </Link>
            <Link href="/subscribers" className="minecraft-button">
              <span>YouTube Stats</span>
            </Link>
          </div>
        </nav>
      )}

      <main className={`flex-grow flex flex-col items-center justify-center ${isFullScreen ? 'p-0' : 'p-8'}`}>
        <motion.div
          className="text-center bg-black bg-opacity-70 p-8 rounded-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold mb-8 minecraft-font text-white">チャンネル登録者数</h1>
          <motion.div
            className="text-8xl font-bold mb-8 text-white"
            key={subscriberCount}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <FaYoutube className="inline-block mr-4 text-red-500" />
            {subscriberCount.toLocaleString()}
          </motion.div>
          <AnimatePresence>
            {subscriberCount > previousCount && previousCount !== 0 && (
              <motion.div
                className="text-2xl text-green-400"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                +{(subscriberCount - previousCount).toLocaleString()} 人増加！
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="mt-8 flex space-x-4">
          <motion.button
            className="minecraft-button"
            onClick={toggleFullScreen}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isFullScreen ? <FaCompress /> : <FaExpand />}
          </motion.button>
          <motion.button
            className={`minecraft-button ${isRealTimeUpdate ? 'bg-green-500' : 'bg-red-500'}`}
            onClick={() => setIsRealTimeUpdate(!isRealTimeUpdate)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            リアルタイム更新: {isRealTimeUpdate ? 'ON' : 'OFF'}
          </motion.button>
          <motion.button
            className="minecraft-button"
            onClick={fetchSubscriberCount}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaSync /> 今すぐ更新
          </motion.button>
        </div>
      </main>
    </div>
  );
};

export default YouTubeStats;