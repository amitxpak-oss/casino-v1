import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Gamepad2, Wallet, Users, Gift, ChevronRight, Star, Flame, Zap, Shield, Sparkles, Play, ArrowRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthModal } from '../context/AuthModalContext';
import { useAuth } from '../context/AuthContext';
import { gameService, leaderboardService } from '../services/api';
import toast from 'react-hot-toast';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openLogin, openSignup } = useAuthModal();
  const [games, setGames] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicData();
  }, []);

  const fetchPublicData = async () => {
    try {
      const [gamesRes, leaderboardRes] = await Promise.all([
        gameService.getAll({}).catch(() => ({ data: { games: [] } })),
        leaderboardService.getTop(5).catch(() => ({ data: { leaders: [] } })),
      ]);
      setGames(gamesRes.data.games || []);
      setLeaderboard(leaderboardRes.data.leaders || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllGames = () => {
    navigate('/dashboard/games');
  };

  const handleProtectedAction = () => {
    toast.error('Please login to continue', { duration: 2000 });
    setTimeout(() => openLogin(), 500);
  };

  const handleGameClick = (game) => {
    if (!user) {
      toast.error('Please login to play games!', { duration: 2000 });
      setTimeout(() => openLogin(), 500);
      return;
    }
    if (game.name?.toLowerCase() === 'ludo') {
      navigate('/dashboard/ludo');
    } else {
      navigate(`/dashboard/games/${game.id}`);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <section className="relative overflow-hidden rounded-3xl mb-8">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1400&h=600&fit=crop" 
            alt="Gaming Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-pink-900/30 via-purple-900/20 to-indigo-900/30" />
        </div>
        
        <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 lg:py-20 text-center">
          <motion.div 
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-purple-500/40"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <Trophy size={40} className="sm:w-12 sm:h-12 text-white drop-shadow-lg" />
          </motion.div>
          
          <motion.h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-2xl">
              IndiaPlay
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto font-medium"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            India's Most Trusted Gaming Platform
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button 
              className="px-10 py-4 rounded-2xl font-bold text-base cursor-pointer bg-white/10 backdrop-blur-xl text-white border border-white/20 transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-white/10 flex items-center justify-center gap-2 group"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={openLogin}
            >
              Sign In
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button 
              className="px-10 py-4 rounded-2xl font-bold text-base cursor-pointer bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-xl shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/50 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={openSignup}
            >
              <Sparkles size={18} />
              Sign Up Free
            </motion.button>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      </section>

      <section className="mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { icon: Gamepad2, label: 'Games', value: '20+', color: '#6366f1', delay: 0 },
            { icon: Users, label: 'Players', value: '50K+', color: '#10b981', delay: 0.1 },
            { icon: Trophy, label: 'Winners', value: '10K+', color: '#f59e0b', delay: 0.2 },
            { icon: Gift, label: 'Won', value: '₹5Cr+', color: '#ef4444', delay: 0.3 },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="group premium-card rounded-2xl p-4 sm:p-6 text-center cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stat.delay }}
              whileHover={{ y: -4 }}
              onClick={handleProtectedAction}
            >
              <div 
                className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${stat.color}15`, boxShadow: `0 0 20px ${stat.color}20` }}
              >
                <stat.icon size={24} className="sm:w-6 sm:h-6" style={{ color: stat.color }} />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-[10px] sm:text-xs text-text-muted font-bold uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-3">
            <span className="p-2 bg-danger/10 rounded-xl">
              <Flame size={22} className="text-danger" />
            </span>
            Trending Games
          </h2>
          <button 
            className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer bg-transparent text-text-secondary border border-white/10 transition-all duration-300 hover:bg-white/5 hover:text-white hover:border-primary/30 flex items-center gap-1"
            onClick={handleViewAllGames}
          >
            View All <ChevronRight size={14} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-3xl skeleton skeleton-card h-[340px] sm:h-[380px]" />
            ))
          ) : games.length > 0 ? (
            games.slice(0, 4).map((game, index) => (
              <motion.div
                key={game.id}
                className="relative rounded-3xl overflow-hidden cursor-pointer group h-[340px] sm:h-[380px]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => handleGameClick(game)}
              >
                <div className="absolute inset-0">
                  <img 
                    src={game.image || `https://picsum.photos/seed/${game.id}/400/500`}
                    alt={game.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-pink-600/30 via-transparent to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute inset-0 border border-white/10 rounded-3xl group-hover:border-pink-500/50 transition-colors duration-300" />
                
                {game.isHot && (
                  <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white text-[11px] font-extrabold flex items-center gap-2 shadow-2xl shadow-red-500/50 animate-pulse z-20">
                    <Flame size={14} className="drop-shadow-lg" />
                    HOT
                  </div>
                )}
                
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl text-white/90 text-[10px] font-bold uppercase tracking-widest border border-white/20">
                    {game.category || 'Arcade'}
                  </span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-2xl border-2 border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-500 shadow-2xl shadow-white/20">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center">
                      <Play size={32} className="text-white ml-1 drop-shadow-lg" />
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-pink-600/80 to-purple-600/80 text-[9px] font-extrabold text-white uppercase tracking-widest backdrop-blur-sm">
                        Premium
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white drop-shadow-2xl tracking-tight">
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
                        {game.players ? new Intl.NumberFormat('en-IN').format(game.players) : '500K'} Online
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-500/30">
                      <TrendingUp size={14} className="text-green-500" />
                      <span className="text-green-500 text-xs font-bold">PLAY NOW</span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-600 via-purple-600 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute inset-0 rounded-3xl group-hover:shadow-2xl group-hover:shadow-pink-500/20 transition-shadow duration-500" />
              </motion.div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-16 text-text-muted">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-bg-card flex items-center justify-center">
                <Gamepad2 size={40} className="opacity-50" />
              </div>
              <h3 className="text-lg font-bold mb-2">Games Coming Soon!</h3>
              <p className="text-sm">Stay tuned for exciting games</p>
            </div>
          )}
        </div>
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-3">
            <span className="p-2 bg-warning/10 rounded-xl">
              <Trophy size={22} className="text-warning" />
            </span>
            Top Winners
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {leaderboard.length > 0 ? (
            leaderboard.slice(0, 5).map((player, index) => (
              <motion.div
                key={player.id || index}
                className="premium-card rounded-xl p-4 flex items-center gap-4 transition-all duration-300 hover:border-primary/30"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ x: 4 }}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-extrabold text-sm sm:text-base shrink-0 ${
                  index === 0 ? 'bg-gradient-to-br from-gold to-amber-600 text-black shadow-lg shadow-gold/30 animate-gold-pulse' :
                  index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
                  index === 2 ? 'bg-gradient-to-br from-amber-700 to-amber-900 text-white' :
                  'bg-primary/10 text-text-muted'
                }`}>
                  {index < 3 ? <Trophy size={18} /> : index + 1}
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-neon-purple flex items-center justify-center font-bold text-base sm:text-lg shrink-0">
                  {player.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm sm:text-base truncate">{player.name}</div>
                  <div className="text-xs text-text-muted">{player.gamesWon || 0} wins</div>
                </div>
                <div className="flex items-center gap-1.5 text-success font-bold text-sm sm:text-base shrink-0">
                  <Sparkles size={16} className="text-gold" />
                  {formatCurrency(player.totalWinnings || player.balance || 0)}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 text-text-muted">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-bg-card flex items-center justify-center">
                <Trophy size={32} className="opacity-50" />
              </div>
              <p>No winners yet - be the first!</p>
            </div>
          )}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-3 mb-5">
          <span className="p-2 bg-primary/10 rounded-xl">
            <Star size={22} className="text-primary" />
          </span>
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Shield, title: 'Secure Platform', desc: 'Enterprise-grade security', color: '#6366f1' },
            { icon: Zap, title: 'Instant Payouts', desc: 'Get winnings instantly', color: '#10b981' },
            { icon: Trophy, title: 'Daily Rewards', desc: 'Earn bonuses daily', color: '#f59e0b' },
            { icon: Users, title: '24/7 Support', desc: 'Always here to help', color: '#ef4444' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="premium-card rounded-2xl p-5 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -4 }}
            >
              <div 
                className="w-12 h-12 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${feature.color}15`, boxShadow: `0 0 20px ${feature.color}20` }}
              >
                <feature.icon size={24} style={{ color: feature.color }} />
              </div>
              <h3 className="text-sm font-bold mb-1">{feature.title}</h3>
              <p className="text-[11px] text-text-muted leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 to-neon-purple/15 border border-primary/20 rounded-3xl p-8 sm:p-12 text-center animate-border-glow">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
          </div>
          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-success to-emerald-400 rounded-full flex items-center justify-center shadow-2xl shadow-success/30 animate-float">
              <Gift size={40} className="text-white" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black mb-3">₹500 Welcome Bonus</h3>
            <p className="text-base text-white/60 mb-6 max-w-md mx-auto">
              Sign up today and get ₹500 bonus on your first deposit!
            </p>
            <motion.button
              className="px-8 py-4 rounded-2xl font-bold text-base cursor-pointer bg-gradient-to-r from-gold to-amber-500 text-black shadow-xl shadow-gold/30 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={openSignup}
            >
              <Sparkles size={20} />
              Claim Bonus
            </motion.button>
          </div>
        </div>
      </section>

      <footer className="text-center py-8 border-t border-white/5">
        <div className="flex justify-center gap-6 sm:gap-8 mb-4">
          <span className="text-xs sm:text-sm text-text-muted cursor-pointer hover:text-primary transition-colors">Terms</span>
          <span className="text-xs sm:text-sm text-text-muted cursor-pointer hover:text-primary transition-colors">Privacy</span>
          <span className="text-xs sm:text-sm text-text-muted cursor-pointer hover:text-primary transition-colors">Support</span>
        </div>
        <p className="text-[11px] sm:text-xs text-text-muted/60">IndiaPlay v1.0.0 • Made with ❤️ in India</p>
      </footer>
    </div>
  );
};

export default Home;
