'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaYoutube, FaDiscord, FaTwitter, FaStar } from 'react-icons/fa';
import { SiScratch } from 'react-icons/si';
import { GiTreasureMap, GiSpellBook } from 'react-icons/gi';

const About = () => {
  const [discoveredStats, setDiscoveredStats] = useState<Set<string>>(new Set());
  const [exp, setExp] = useState(0);
  
  const socialLinks = [
    { name: 'YouTube', icon: FaYoutube, url: 'https://www.youtube.com/@%E4%BE%8B%E3%81%AE%E3%83%A4%E3%83%84', color: 'bg-red-600' },
    { name: 'Discord', icon: FaDiscord, url: 'https://discord.gg/mQQhVRpuqa', color: 'bg-indigo-600' },
    { name: 'Scratch', icon: SiScratch, url: 'https://scratch.mit.edu/users/min-brother/', color: 'bg-orange-500' },
    { name: 'X', icon: FaTwitter, url: 'https://twitter.com/min_brother2158', color: 'bg-blue-500' },
  ];

  const stats = [
    { id: 'height', label: '身長', value: '140cmくらい', expReward: 20 },
    { id: 'hobby', label: '趣味', value: '物作り、ゲーム、ペン回し', expReward: 30 },
    { id: 'favorite', label: '好物', value: 'ジャンクフード、みかん', expReward: 25 },
  ];

  const discoverStat = (statId: string, expReward: number) => {
    if (!discoveredStats.has(statId)) {
      setDiscoveredStats(prev => new Set(Array.from(prev).concat(statId)));
      setExp(prev => prev + expReward);
      createParticles();
    }
  };

  const createParticles = () => {
    const particles = document.createElement('div');
    particles.className = 'particles';
    
    for (let i = 0; i < 10; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.setProperty('--x', `${(Math.random() - 0.5) * 100}px`);
      particle.style.setProperty('--y', `${(Math.random() - 0.5) * 100}px`);
      particles.appendChild(particle);
    }

    document.body.appendChild(particles);
    setTimeout(() => document.body.removeChild(particles), 1000);
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="background-image"></div>
      
      <div className="main-content flex flex-col items-center justify-center">
        {/* ステータスバー */}
        <div className="fixed top-0 left-0 w-full bg-black bg-opacity-80 p-2 flex items-center justify-between z-50">
          <div className="flex items-center gap-4">
            <span className="minecraft-font">探索進捗: {Math.round((discoveredStats.size / stats.length) * 100)}%</span>
            <div className="exp-bar w-48">
              <div className="exp-fill" style={{ width: `${exp}%` }}></div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <GiSpellBook className="text-2xl" />
            <span className="minecraft-font">発見したステータス: {discoveredStats.size}/{stats.length}</span>
          </div>
        </div>

        <nav className="navbar w-full p-4 text-white flex justify-between items-center slide-down mt-12">
          <div className="flex items-center space-x-2">
            <motion.img 
              src="/icon.png" 
              alt="Icon" 
              className="h-8 w-8 floating-block"
              whileHover={{ scale: 1.1 }}
            />
            <div className="text-lg font-bold minecraft-font">例のやつ：About</div>
          </div>
          <div className="flex space-x-4 minecraft-font">
            <Link href="/" className="minecraft-button"><span>Home</span></Link>
            <Link href="/about" className="minecraft-button"><span>About</span></Link>
            <Link href="/contact" className="minecraft-button"><span>Contact</span></Link>
          </div>
        </nav>

        <main className="flex-grow flex flex-col items-center justify-center w-full p-8 space-y-12">
          <motion.div
            className="minecraft-container rounded-lg shadow-lg p-10 w-full max-w-6xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-12">
              <motion.img 
                src="/icon.png" 
                alt="Icon" 
                className="w-64 h-64 rounded-full shadow-md floating-block"
                whileHover={{ scale: 1.1 }}
              />
              <div className="flex-grow text-white">
                <h1 className="text-4xl font-bold mb-8 text-center lg:text-left minecraft-font">自己紹介</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {stats.map((stat) => (
                    <motion.div
                      key={stat.id}
                      className={`minecraft-container cursor-pointer transition-all duration-300 ${
                        discoveredStats.has(stat.id) ? 'border-yellow-400' : ''
                      }`}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => discoverStat(stat.id, stat.expReward)}
                    >
                      <p className="text-2xl font-semibold minecraft-font mb-2">{stat.label}:</p>
                      <div className="flex items-center gap-2">
                        {discoveredStats.has(stat.id) ? (
                          <>
                            <p className="text-xl">{stat.value}</p>
                            <FaStar className="text-yellow-400" />
                          </>
                        ) : (
                          <p className="text-xl">??? (クリックで解放)</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="w-full max-w-6xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-center text-white minecraft-font">SNSリンク</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`minecraft-button flex items-center justify-center p-6 ${link.color}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <link.icon className="text-4xl mr-4" />
                  <span className="text-2xl font-bold minecraft-font">{link.name}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="w-full max-w-6xl mt-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-center text-white minecraft-font">座右の銘</h2>
            <div className="flex flex-col items-center minecraft-container">
              <motion.img 
                src="/meigen.png" 
                alt="座右の銘" 
                className="w-full h-auto max-w-3xl rounded-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
              />
              <p className="text-2xl font-bold text-white text-center mt-4 minecraft-font">
                「みかんはこの世の心理である」
              </p>
            </div>
          </motion.div>
        </main>

        <footer className="w-full bg-gray-800 text-white p-4 text-center">
          <p>© 2024 例のやつ. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default About;