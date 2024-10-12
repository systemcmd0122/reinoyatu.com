'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaStar, FaCheck } from 'react-icons/fa';
import { GiScrollUnfurled, GiSpellBook } from 'react-icons/gi';

const Contact = () => {
  const [formLevel, setFormLevel] = useState(1);
  const [exp, setExp] = useState(0);
  const [showAchievement, setShowAchievement] = useState('');
  const [achievements, setAchievements] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [questProgress, setQuestProgress] = useState({
    visitPage: true,
    startForm: false,
    completeForm: false
  });

  const unlockAchievement = (achievement: string) => {
    if (!achievements.includes(achievement)) {
      setAchievements(prev => [...prev, achievement]);
      setShowAchievement(achievement);
      setTimeout(() => setShowAchievement(''), 3000);
    }
  };

  const addExp = (amount: number) => {
    setExp(prev => {
      const newExp = prev + amount;
      if (newExp >= 100) {
        setFormLevel(l => l + 1);
        unlockAchievement('フォームマスター');
        return newExp - 100;
      }
      return newExp;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // 入力に応じてEXPを加算
    addExp(1);

    if (!questProgress.startForm) {
      setQuestProgress(prev => ({ ...prev, startForm: true }));
      unlockAchievement('フォーム入力開始！');
    }
  };

  const createParticles = (e: React.MouseEvent) => {
    const particles = document.createElement('div');
    particles.className = 'particles';
    particles.style.left = `${e.clientX}px`;
    particles.style.top = `${e.clientY}px`;

    for (let i = 0; i < 5; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.setProperty('--x', `${(Math.random() - 0.5) * 100}px`);
      particle.style.setProperty('--y', `${(Math.random() - 0.5) * 100}px`);
      particles.appendChild(particle);
    }

    document.body.appendChild(particles);
    setTimeout(() => document.body.removeChild(particles), 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // フォーム送信時の処理
    if (formData.name && formData.email && formData.message) {
      setQuestProgress(prev => ({ ...prev, completeForm: true }));
      unlockAchievement('完璧な問い合わせ！');
      addExp(50);
      
      // フォームをリセット
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="background-image"></div>
      
      <div className="main-content flex-grow flex flex-col">
        {/* ステータスバー */}
        <div className="fixed top-0 left-0 w-full bg-black bg-opacity-80 p-2 flex items-center justify-between z-50">
          <div className="flex items-center gap-4">
            <span className="minecraft-font">Form Level {formLevel}</span>
            <div className="exp-bar w-48">
              <div className="exp-fill" style={{ width: `${exp}%` }}></div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <GiScrollUnfurled className="text-2xl" />
            <FaStar className="text-2xl" title={`実績: ${achievements.length}`} />
          </div>
        </div>

        {/* ナビゲーションバー */}
        <nav className="w-full p-4 navbar text-white flex justify-between items-center slide-down mt-12">
          <div className="flex items-center space-x-2">
            <motion.img 
              src="/icon.png" 
              alt="Icon" 
              className="h-8 w-8 floating-block"
              whileHover={{ scale: 1.1 }}
              onClick={(e) => {
                createParticles(e);
                addExp(10);
              }}
            />
            <div className="text-lg font-bold minecraft-font">例のやつ：Contact</div>
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

        {/* メインコンテンツ */}
        <main className="flex-grow flex items-center justify-center p-4">
          <motion.section 
            className="contact-section bg-zinc-800 bg-opacity-90 rounded-lg shadow-lg p-10 w-full max-w-6xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-4 text-center minecraft-font">お問い合わせ</h2>
            
            {/* クエストログ */}
            <div className="quest-log mb-8">
              <h3 className="text-xl font-bold mb-4 minecraft-font">現在のクエスト</h3>
              <div className="quest-item">
                <GiSpellBook className="mr-2" />
                <span className={questProgress.visitPage ? 'quest-complete' : ''}>
                  お問い合わせページに到着 {questProgress.visitPage && <FaCheck />}
                </span>
              </div>
              <div className="quest-item">
                <GiSpellBook className="mr-2" />
                <span className={questProgress.startForm ? 'quest-complete' : ''}>
                  フォームの入力を開始 {questProgress.startForm && <FaCheck />}
                </span>
              </div>
              <div className="quest-item">
                <GiSpellBook className="mr-2" />
                <span className={questProgress.completeForm ? 'quest-complete' : ''}>
                  フォームを完成させる {questProgress.completeForm && <FaCheck />}
                </span>
              </div>
            </div>

            {/* コンタクトフォーム */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-group">
                <label className="block mb-2 minecraft-font">お名前</label>
                <motion.input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="minecraft-input w-full p-3 rounded-lg border-2 border-gray-600 bg-gray-700"
                  whileFocus={{ scale: 1.02 }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="block mb-2 minecraft-font">メールアドレス</label>
                <motion.input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="minecraft-input w-full p-3 rounded-lg border-2 border-gray-600 bg-gray-700"
                  whileFocus={{ scale: 1.02 }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="block mb-2 minecraft-font">メッセージ</label>
                <motion.textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="minecraft-input w-full p-3 rounded-lg border-2 border-gray-600 bg-gray-700"
                  whileFocus={{ scale: 1.02 }}
                  required
                />
              </div>

              <motion.button
                type="submit"
                className="minecraft-button w-full py-3 text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => createParticles(e as any)}
              >
                <FaEnvelope className="inline-block mr-2" />
                送信
              </motion.button>
            </form>
          </motion.section>
        </main>

        {/* 実績ポップアップ */}
        <AnimatePresence>
          {showAchievement && (
            <motion.div
              className="achievement-popup"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
            >
              <FaStar className="text-yellow-400" />
              <span className="minecraft-font">実績解除：{showAchievement}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="footer bg-gray-800 text-white p-4 text-center">
          <p>© 2024 例のやつ. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Contact;