'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaYoutube, FaGamepad, FaCode, FaTrophy, FaHeart, FaStar, FaCoins, FaShieldAlt, FaSyncAlt } from 'react-icons/fa';
import { GiTreasureMap, GiSpellBook, GiScrollUnfurled, GiSwordman, GiMagicSwirl, GiUpgrade, GiDragonSpiral, GiOpenTreasureChest } from 'react-icons/gi';

interface GameState {
  exp: number;
  level: number;
  achievements: string[];
  inventory: string[];
  questLog: { title: string; completed: boolean }[];
  coins: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  strength: number;
  defense: number;
  lastLogin: number;
}

const INITIAL_STATE: GameState = {
  exp: 0,
  level: 1,
  achievements: [],
  inventory: Array(9).fill(''),
  questLog: [
    { title: 'サイトを訪問する', completed: true },
    { title: '自己紹介を読む', completed: false },
    { title: 'お問い合わせフォームを見つける', completed: false },
    { title: '全ての特徴を探索する', completed: false },
    { title: 'レベル5に到達する', completed: false },
    { title: '100コインを貯める', completed: false },
    { title: '最初のボスを倒す', completed: false },
  ],
  coins: 0,
  health: 100,
  maxHealth: 100,
  mana: 50,
  maxMana: 50,
  strength: 10,
  defense: 5,
  lastLogin: Date.now(),
};

const Home = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [showAchievement, setShowAchievement] = useState('');
  const [showQuest, setShowQuest] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showBoss, setShowBoss] = useState(false);
  const [bossHealth, setBossHealth] = useState(1000);

  useEffect(() => {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      setGameState(prevState => ({
        ...parsedState,
        lastLogin: Date.now(),
      }));
      
      // Offline progression
      const timeDiff = Date.now() - parsedState.lastLogin;
      const hoursOffline = timeDiff / (1000 * 60 * 60);
      const offlineExp = Math.floor(hoursOffline * 10);
      const offlineCoins = Math.floor(hoursOffline * 5);
      
      if (offlineExp > 0 || offlineCoins > 0) {
        setTimeout(() => {
          alert(`オフライン中に獲得しました：\n経験値 +${offlineExp}\nコイン +${offlineCoins}`);
          addExp(offlineExp);
          addCoins(offlineCoins);
        }, 1000);
      }
    }
  }, []);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      localStorage.setItem('gameState', JSON.stringify({...gameState, lastLogin: Date.now()}));
    }, 5000);

    return () => clearInterval(saveInterval);
  }, [gameState]);

  const features = [
    {
      icon: FaYoutube,
      title: "YouTube活動",
      description: "ゲーム実況や小ネタなど、様々なコンテンツを配信しています！",
      color: "bg-red-600",
      expReward: 50
    },
    {
      icon: FaGamepad,
      title: "ゲーム制作",
      description: "scratchのオリジナルゲームの制作や、モッド開発なども行っています。",
      color: "bg-blue-600",
      expReward: 75
    },
    {
      icon: FaCode,
      title: "プログラミング",
      description: "Web開発やゲーム開発など、様々なプログラミングに挑戦中！",
      color: "bg-green-600",
      expReward: 100
    },
    {
      icon: GiMagicSwirl,
      title: "魔法の研究",
      description: "古代の魔法書を解読し、新しい呪文の開発に取り組んでいます。",
      color: "bg-purple-600",
      expReward: 125
    }
  ];

  const addExp = (amount: number) => {
    setGameState(prev => {
      const newExp = prev.exp + amount;
      let newLevel = prev.level;
      let remainingExp = newExp;

      while (remainingExp >= 100) {
        newLevel++;
        remainingExp -= 100;
        unlockAchievement('レベルアップ！');
        if (newLevel === 5) {
          completeQuest('レベル5に到達する');
        }
      }

      return { 
        ...prev, 
        exp: remainingExp, 
        level: newLevel,
        maxHealth: 100 + (newLevel - 1) * 20,
        maxMana: 50 + (newLevel - 1) * 10,
        strength: 10 + (newLevel - 1) * 2,
        defense: 5 + (newLevel - 1) * 1
      };
    });
  };

  const unlockAchievement = (achievement: string) => {
    setGameState(prev => {
      if (!prev.achievements.includes(achievement)) {
        setShowAchievement(achievement);
        setTimeout(() => setShowAchievement(''), 3000);
        return { ...prev, achievements: [...prev.achievements, achievement] };
      }
      return prev;
    });
  };

  const completeQuest = (questTitle: string) => {
    setGameState(prev => ({
      ...prev,
      questLog: prev.questLog.map(quest => 
        quest.title === questTitle ? { ...quest, completed: true } : quest
      )
    }));
  };

  const addCoins = (amount: number) => {
    setGameState(prev => {
      const newCoins = prev.coins + amount;
      if (newCoins >= 100 && !prev.questLog.find(q => q.title === '100コインを貯める')?.completed) {
        completeQuest('100コインを貯める');
      }
      return { ...prev, coins: newCoins };
    });
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

  const handleFeatureClick = (feature: typeof features[0]) => {
    addExp(feature.expReward);
    addCoins(Math.floor(feature.expReward / 2));
    unlockAchievement(`${feature.title}マスター`);
    if (gameState.questLog.find(quest => quest.title === '全ての特徴を探索する' && !quest.completed)) {
      if (features.every(f => gameState.achievements.includes(`${f.title}マスター`))) {
        completeQuest('全ての特徴を探索する');
      }
    }
  };

  const shopItems = [
    { name: '回復ポーション', cost: 50, effect: () => heal(50) },
    { name: 'マナポーション', cost: 50, effect: () => restoreMana(25) },
    { name: '力の指輪', cost: 100, effect: () => upgradeStrength(5) },
    { name: '守りの盾', cost: 100, effect: () => upgradeDefense(5) },
  ];

  const heal = (amount: number) => {
    setGameState(prev => ({
      ...prev,
      health: Math.min(prev.health + amount, prev.maxHealth)
    }));
  };

  const restoreMana = (amount: number) => {
    setGameState(prev => ({
      ...prev,
      mana: Math.min(prev.mana + amount, prev.maxMana)
    }));
  };

  const upgradeStrength = (amount: number) => {
    setGameState(prev => ({
      ...prev,
      strength: prev.strength + amount
    }));
  };

  const upgradeDefense = (amount: number) => {
    setGameState(prev => ({
      ...prev,
      defense: prev.defense + amount
    }));
  };

  const buyItem = (item: typeof shopItems[0]) => {
    if (gameState.coins >= item.cost) {
      setGameState(prev => ({
        ...prev,
        coins: prev.coins - item.cost
      }));
      item.effect();
      unlockAchievement('初めての購入！');
    } else {
      alert('コインが足りません！');
    }
  };

  const attackBoss = () => {
    const damage = Math.max(0, gameState.strength - 20);
    setBossHealth(prev => Math.max(0, prev - damage));
    setGameState(prev => ({
      ...prev,
      health: Math.max(0, prev.health - 10),
      mana: Math.max(0, prev.mana - 5)
    }));

    if (bossHealth - damage <= 0) {
      unlockAchievement('ボス撃破！');
      completeQuest('最初のボスを倒す');
      setShowBoss(false);
      addExp(500);
      addCoins(1000);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="background-image"></div>
      
      <div className="main-content flex-grow flex flex-col">
        {/* ステータスバー */}
        <div className="fixed top-0 left-0 w-full bg-black bg-opacity-80 p-2 flex items-center justify-between z-50">
          <div className="flex items-center gap-4">
            <span className="minecraft-font">Level {gameState.level}</span>
            <div className="exp-bar w-48">
              <div className="exp-fill" style={{ width: `${gameState.exp}%` }}></div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <FaHeart className="text-red-500" />
            <span>{gameState.health}/{gameState.maxHealth}</span>
            <GiMagicSwirl className="text-blue-500" />
            <span>{gameState.mana}/{gameState.maxMana}</span>
            <FaCoins className="text-yellow-500" />
            <span>{gameState.coins}</span>
            <GiScrollUnfurled 
              className="text-2xl cursor-pointer" 
              onClick={() => setShowQuest(!showQuest)}
            />
            <FaTrophy 
              className="text-2xl" 
              title={`実績: ${gameState.achievements.length}`} 
            />
            <GiUpgrade
              className="text-2xl cursor-pointer"
              onClick={() => setShowShop(!showShop)}
            />
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
                addCoins(5);
              }}
            />
            <div className="text-lg font-bold minecraft-font">例のやつ</div>
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
          </div>
        </nav>

        <main className="flex-grow container mx-auto px-4 py-8">
          {/* ヒーローセクション */}
          <motion.section 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl font-bold mb-6 minecraft-font">
              Welcome to My World!
            </h1>
            <p className="text-xl mb-8">
              このサイトを探索して、隠された実績を見つけよう！
            </p>
            <button
              className="minecraft-button text-2xl"
              onClick={() => setShowBoss(true)}
            >
              <GiDragonSpiral className="inline-block mr-2" />
              ボスに挑戦
            </button>
          </motion.section>
          {/* 特徴セクション */}
          <motion.section 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`${feature.color} rounded-lg p-6 text-white shadow-lg transform transition-all duration-300 hover:scale-105 cursor-pointer`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={(e) => {
                  createParticles(e);
                  handleFeatureClick(feature);
                }}
              >
                <feature.icon className="text-4xl mb-4" />
                <h3 className="text-xl font-bold mb-2 minecraft-font">{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </motion.section>

          {/* インベントリ */}
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-6 minecraft-font text-center">インベントリ</h2>
            <div className="inventory-grid max-w-2xl mx-auto">
              {gameState.inventory.map((item, index) => (
                <div 
                  key={index} 
                  className="inventory-slot"
                  onClick={() => {
                    if (!item) {
                      setGameState(prev => {
                        const newInventory = [...prev.inventory];
                        const randomItem = ['木の剣', '石のツルハシ', 'リンゴ', '革の鎧'][Math.floor(Math.random() * 4)];
                        newInventory[index] = randomItem;
                        addExp(25);
                        addCoins(10);
                        unlockAchievement('アイテム発見！');
                        return { ...prev, inventory: newInventory };
                      });
                    } else {
                      alert(`${item}を使用しました！`);
                      setGameState(prev => {
                        const newInventory = [...prev.inventory];
                        newInventory[index] = '';
                        return { ...prev, inventory: newInventory };
                      });
                    }
                  }}
                >
                  {item ? <GiTreasureMap className="text-2xl" /> : null}
                  <span className="item-name">{item}</span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ミニゲーム：クリッカー */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6 minecraft-font text-center">ミニゲーム：クリッカー</h2>
            <div className="flex flex-col items-center">
              <GiSwordman 
                className="text-6xl cursor-pointer transform transition-all duration-300 hover:scale-110"
                onClick={(e) => {
                  createParticles(e);
                  addExp(1);
                  addCoins(1);
                  if (Math.random() < 0.1) {
                    unlockAchievement('ラッキークリック！');
                    addExp(10);
                    addCoins(10);
                  }
                }}
              />
              <p className="mt-4">クリックしてEXPとコインを獲得しよう！</p>
            </div>
          </motion.section>

          {/* デイリーボーナス */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-6 minecraft-font text-center">デイリーボーナス</h2>
            <div className="flex justify-center">
              <button
                className="minecraft-button text-2xl"
                onClick={() => {
                  const lastClaim = localStorage.getItem('lastDailyClaim');
                  const now = new Date();
                  if (!lastClaim || new Date(lastClaim).getDate() !== now.getDate()) {
                    addExp(100);
                    addCoins(50);
                    unlockAchievement('デイリーボーナス受取！');
                    localStorage.setItem('lastDailyClaim', now.toISOString());
                    alert('デイリーボーナスを受け取りました！');
                  } else {
                    alert('デイリーボーナスは既に受け取っています。また明日来てください！');
                  }
                }}
              >
                <GiOpenTreasureChest className="inline-block mr-2" />
                デイリーボーナスを受け取る
              </button>
            </div>
          </motion.section>
        </main>

        {/* 実績ポップアップ */}
        <AnimatePresence>
          {showAchievement && (
            <motion.div
              className="achievement-popup"
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ duration: 0.5 }}
            >
              <FaTrophy className="text-yellow-400 text-2xl" />
              <div>
                <h3 className="minecraft-font text-yellow-400">実績解除！</h3>
                <p>{showAchievement}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* クエストログ */}
        <AnimatePresence>
          {showQuest && (
            <motion.div
              className="quest-log fixed top-20 right-4 w-80 bg-black bg-opacity-80 p-4 rounded-lg"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              <h2 className="text-2xl font-bold mb-4 minecraft-font">クエストログ</h2>
              {gameState.questLog.map((quest, index) => (
                <div key={index} className={`quest-item ${quest.completed ? 'quest-complete' : ''}`}>
                  <GiSpellBook />
                  <span>{quest.title}</span>
                  {quest.completed && <FaStar className="text-yellow-400" />}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ショップ */}
        <AnimatePresence>
          {showShop && (
            <motion.div
              className="shop fixed top-20 left-4 w-80 bg-black bg-opacity-80 p-4 rounded-lg"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <h2 className="text-2xl font-bold mb-4 minecraft-font">ショップ</h2>
              {shopItems.map((item, index) => (
                <div key={index} className="shop-item flex justify-between items-center mb-2">
                  <span>{item.name}</span>
                  <button
                    className="minecraft-button"
                    onClick={() => buyItem(item)}
                  >
                    購入 ({item.cost} コイン)
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ボス戦 */}
        <AnimatePresence>
          {showBoss && (
            <motion.div
              className="boss-battle fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="boss-content text-center">
                <h2 className="text-4xl font-bold mb-4 minecraft-font">ボス戦</h2>
                <div className="boss-health-bar w-full h-8 bg-red-900 mb-4">
                  <div
                    className="h-full bg-red-500"
                    style={{ width: `${(bossHealth / 1000) * 100}%` }}
                  ></div>
                </div>
                <p className="mb-4">ボスのHP: {bossHealth}/1000</p>
                <button
                  className="minecraft-button text-2xl mb-4"
                  onClick={attackBoss}
                >
                  <GiSwordman className="inline-block mr-2" />
                  攻撃
                </button>
                <button
                  className="minecraft-button text-2xl"
                  onClick={() => setShowBoss(false)}
                >
                  撤退
                </button>
              </div>
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

export default Home;