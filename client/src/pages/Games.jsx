import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Flame, Star, Play, Users, Search, TrendingUp, X, Sparkles, Zap, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { gameService } from '../services/api';

const Games = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [categories] = useState(['All', 'Matka', 'Sport', 'Prediction', 'Arcade', 'Card']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    let result = [...games];
    if (selectedCategory !== 'All') {
      result = result.filter(g => g.category?.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (filter === 'hot') {
      result = result.filter(g => g.isHot);
    } else if (filter === 'featured') {
      result = result.filter(g => g.isFeatured);
    }
    if (searchQuery) {
      result = result.filter(g => g.name?.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setFilteredGames(result);
  }, [games, selectedCategory, filter, searchQuery]);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const response = await gameService.getAll({});
      setGames(response.data.games || []);
    } catch (error) {
      console.error('Failed to fetch games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (game) => {
    navigate(`/dashboard/games/${game.id}`);
  };

  const getGradient = (color) => {
    const gradients = {
      '#6366f1': 'from-indigo-600 to-purple-700',
      '#10b981': 'from-emerald-600 to-teal-700',
      '#f59e0b': 'from-amber-600 to-orange-700',
      '#ef4444': 'from-red-600 to-pink-700',
      '#8b5cf6': 'from-violet-600 to-purple-700',
    };
    return gradients[color] || 'from-indigo-600 to-purple-700';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 200, damping: 20 }
    }
  };

  return (
    <div className="h-full flex flex-col min-h-0 bg-gradient-to-b from-[#0a0a14] to-[#050508]">
      {/* Premium Header */}
      <div className="flex-shrink-0 pb-4 border-b border-white/10 bg-gradient-to-b from-[#0a0a14] to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Gamepad2 size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Games</h1>
              <p className="text-xs text-gray-400">{filteredGames.length} games available</p>
            </div>
          </div>
          <button
            className="md:hidden w-10 h-10 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search size={18} />
          </button>
        </div>

        {/* Search - Desktop */}
        <div className="hidden md:block mt-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-1">
              <Search size={18} className="ml-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 py-3.5 pl-3 bg-transparent text-white placeholder:text-gray-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  className="p-2 mr-1 rounded-lg hover:bg-white/10 transition-colors"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={16} className="text-gray-400" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search - Mobile */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden mt-4 overflow-hidden"
            >
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 pl-10 pr-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50"
                  autoFocus
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0 pt-4 space-y-4">
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-shrink-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {[
            { key: 'all', label: 'All Games', icon: Gamepad2 },
            { key: 'hot', label: 'Hot', icon: Flame },
            { key: 'featured', label: 'Featured', icon: Star },
          ].map((tab, idx) => (
            <motion.button
              key={tab.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
                filter === tab.key
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/40 shadow-xl'
                  : 'bg-white/5 backdrop-blur-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setFilter(tab.key)}
              whileTap={{ scale: 0.95 }}
            >
              <tab.icon size={16} />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-shrink-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {categories.map((cat, idx) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={`py-2 px-4 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-indigo-500/30 to-purple-500/30 text-indigo-400 border border-indigo-500/40 shadow-lg shadow-indigo-500/20'
                  : 'bg-white/5 backdrop-blur-xl border border-white/10 text-gray-400 hover:text-white'
              }`}
              onClick={() => setSelectedCategory(cat)}
              whileTap={{ scale: 0.95 }}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="flex-shrink-0">
          {loading ? (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <motion.div
                  key={i}
                  variants={cardVariants}
                  className="rounded-3xl overflow-hidden"
                >
                  <div className="rounded-3xl skeleton skeleton-card skeleton-glow">
                    <div className="h-32 sm:h-40 rounded-t-3xl skeleton" />
                    <div className="p-4">
                      <div className="h-4 w-3/4 rounded-lg skeleton mb-3" />
                      <div className="h-3 w-1/2 rounded-lg skeleton" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : filteredGames.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center mb-4">
                <Gamepad2 size={40} className="text-gray-600" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Games Found</h3>
              <p className="text-sm text-gray-400">Try adjusting your filters</p>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredGames.map((game, idx) => (
                <motion.div
                  key={game.id}
                  variants={cardVariants}
                  className="group relative"
                  whileHover={{ y: -4 }}
                >
                  {/* Glow Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${getGradient(game.color)} rounded-3xl blur-xl opacity-0 group-hover:opacity-25 transition-opacity duration-500`}
                  />

                  {/* Card */}
                  <motion.div
                    className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-white/10 shadow-xl transition-all duration-300 group-hover:border-white/20 group-hover:shadow-2xl"
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Top Gradient Area */}
                    <div className={`relative h-28 md:h-32 bg-gradient-to-br ${getGradient(game.color)} overflow-hidden`}>
                      {/* Overlay Pattern */}
                      <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: `radial-gradient(circle at 50% 50%, transparent 20%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.1) 40%, transparent 40%)`
                      }} />

                      {/* Game Icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl md:text-6xl font-black text-white/90 drop-shadow-2xl">
                          {game.icon || game.name?.charAt(0)}
                        </span>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        {game.isHot && (
                          <motion.div
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="px-2 py-1 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-lg"
                          >
                            <Flame size={10} />
                            HOT
                          </motion.div>
                        )}
                        {game.isFeatured && !game.isHot && (
                          <motion.div
                            initial={{ scale: 0, rotate: 10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="px-2 py-1 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-[10px] font-bold flex items-center gap-1 shadow-lg"
                          >
                            <Star size={10} />
                            FEATURED
                          </motion.div>
                        )}
                      </div>

                      {/* Players Badge */}
                      <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-xl text-white text-[10px] font-medium flex items-center gap-1">
                        <Users size={10} />
                        {game.players || 0}
                      </div>
                    </div>

                    {/* Bottom Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-base text-white mb-1 truncate">{game.name}</h3>
                      <p className="text-xs text-gray-400 capitalize mb-4">{game.category}</p>

                      {/* Play Button */}
                      <motion.button
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 transition-all duration-300 group-hover:shadow-indigo-500/50 group-hover:scale-[1.02]"
                        onClick={() => handlePlay(game)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Play size={16} />
                        Play Now
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative rounded-3xl overflow-hidden mb-4"
        >
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-indigo-900/50" />
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl" />

          <div className="relative p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/30 shrink-0">
              <TrendingUp size={28} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white mb-1">New Games Coming Soon!</h3>
              <p className="text-xs text-gray-300">Exciting new games every week</p>
            </div>
            <motion.button
              className="px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white text-sm font-semibold flex items-center gap-2 shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles size={16} />
              Notify
            </motion.button>
          </div>
        </motion.div>

        {/* Spacer for bottom nav */}
        <div className="h-8" />
      </div>
    </div>
  );
};

export default Games;
