import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Flame, Star, Play, Users, Search, TrendingUp, X, Sparkles, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { gameService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Games = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [categories] = useState(['All', 'Matka', 'Sport', 'Prediction', 'Arcade', 'Card']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

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
    if (!user) {
      setSelectedGame(game);
      setShowLoginPrompt(true);
      toast.error('Please login to play games!');
      return;
    }
    
    if (game.name?.toLowerCase() === 'ludo') {
      navigate('/dashboard/ludo');
    } else {
      navigate(`/dashboard/games/${game.id}`);
    }
  };

  const handleLoginPromptClose = () => {
    setShowLoginPrompt(false);
    setSelectedGame(null);
  };

  const handleGoToLogin = () => {
    setShowLoginPrompt(false);
    navigate('/login');
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
      {/* Login Prompt Modal */}
      <AnimatePresence>
        {showLoginPrompt && selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleLoginPromptClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="premium-card rounded-3xl p-6 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/30">
                <Lock size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Login Required</h3>
              <p className="text-gray-400 mb-4">
                Please login to play <span className="text-white font-semibold">{selectedGame?.name}</span> and win exciting rewards!
              </p>
              <div className="flex flex-col gap-3">
                <motion.button
                  onClick={handleGoToLogin}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Login Now
                </motion.button>
                <button
                  onClick={handleLoginPromptClose}
                  className="w-full py-3 rounded-xl bg-white/5 text-gray-400 font-medium hover:text-white transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="rounded-3xl skeleton skeleton-card h-[340px] sm:h-[360px]" />
              ))}
            </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  className="relative rounded-3xl overflow-hidden cursor-pointer group h-[340px] sm:h-[360px]"
                  onClick={() => handlePlay(game)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, type: 'spring', stiffness: 100 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className="absolute inset-0">
                    <img 
                      src={game.image || `https://picsum.photos/seed/${game.id}/400/500`}
                      alt={game.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-transparent to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute inset-0 border border-white/10 rounded-3xl group-hover:border-indigo-500/50 transition-colors duration-300" />
                  
                  {game.isHot && (
                    <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white text-[11px] font-extrabold flex items-center gap-2 shadow-2xl shadow-red-500/50 animate-pulse z-20">
                      <Flame size={14} className="drop-shadow-lg" />
                      <span className="tracking-wider">HOT</span>
                    </div>
                  )}
                  
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl text-white/90 text-[10px] font-bold uppercase tracking-widest border border-white/20">
                      {game.category || 'Gaming'}
                    </span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-2xl border-2 border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-500 shadow-2xl shadow-white/20">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                        <Play size={32} className="text-white ml-1 drop-shadow-lg" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-indigo-600/80 to-purple-600/80 text-[9px] font-extrabold text-white uppercase tracking-widest backdrop-blur-sm">
                          Premium
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-white drop-shadow-2xl tracking-tight">
                        {game.name}
                      </h3>
                      <p className="text-sm text-white/60 mt-1 line-clamp-2">
                        {game.description || `Win big with ${game.name}!`}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-white/80 text-xs font-semibold">
                          {game.players ? new Intl.NumberFormat('en-IN').format(game.players) : '10K'} Online
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-500/30">
                        <TrendingUp size={14} className="text-green-500" />
                        <span className="text-green-500 text-xs font-bold">PLAY NOW</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute inset-0 rounded-3xl group-hover:shadow-2xl group-hover:shadow-indigo-500/20 transition-shadow duration-500" />
                </motion.div>
              ))}
            </div>
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
