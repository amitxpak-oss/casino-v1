import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, TrendingUp, Trophy, Gift, ArrowUpRight, ArrowDownRight, Gamepad2, ChevronRight, Users, Sparkles, Flame, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { walletService, gameService, leaderboardService } from '../services/api';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const gamesRes = await gameService.getAll({ limit: 4 });
      const leaderboardRes = await leaderboardService.getTop(5);
      
      setGames(gamesRes.data?.games || []);
      setLeaderboard(leaderboardRes.data?.leaders || []);
      
      try {
        const transactionsRes = await walletService.getTransactions(1, 5);
        setTransactions(transactionsRes.data?.transactions || []);
      } catch (txError) {
        console.log('Transactions fetch skipped:', txError.message);
        setTransactions([]);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
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

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'DEPOSIT':
      case 'BONUS':
        return { icon: ArrowDownRight, bg: 'bg-success/10', color: 'text-success' };
      case 'WITHDRAW':
        return { icon: ArrowUpRight, bg: 'bg-danger/10', color: 'text-danger' };
      case 'WINNING':
      case 'GAME_WIN':
        return { icon: Trophy, bg: 'bg-warning/10', color: 'text-warning' };
      default:
        return { icon: Gift, bg: 'bg-primary/10', color: 'text-primary' };
    }
  };

  if (authLoading || !user) {
    return (
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-6 w-24 rounded skeleton mb-2" />
            <div className="h-10 w-40 rounded-lg skeleton" />
          </div>
          <div className="w-14 h-14 rounded-2xl skeleton skeleton-avatar" />
        </div>

        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 mb-8 skeleton skeleton-card">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjxwYXRoIGQ9Ik0wIDMwYzE2LjU5MjcgMCAzMC0xMy40MDczIDMwLTMwdjMwYzAgMTYuNTkyNy0xMy40MDczIDMwLTMwIDMwSDB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <div className="h-4 w-32 rounded skeleton mb-3" />
                <div className="h-12 w-44 sm:h-14 sm:w-52 rounded-xl skeleton" />
              </div>
              <div className="w-14 h-14 rounded-2xl skeleton" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
              <div className="h-20 sm:h-24 rounded-2xl skeleton" />
              <div className="h-20 sm:h-24 rounded-2xl skeleton" />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 h-14 rounded-2xl skeleton" />
              <div className="flex-1 h-14 rounded-2xl skeleton" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl skeleton skeleton-card p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 rounded-2xl skeleton" />
              <div className="h-8 w-16 mx-auto rounded skeleton mb-2" />
              <div className="h-3 w-20 mx-auto rounded skeleton" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl skeleton skeleton-card p-4 sm:p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl skeleton" />
              <div className="h-4 w-16 mx-auto rounded skeleton" />
            </div>
          ))}
        </div>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl skeleton" />
              <div>
                <div className="h-6 w-32 rounded skeleton mb-2" />
                <div className="h-3 w-24 rounded skeleton" />
              </div>
            </div>
            <div className="h-9 w-20 rounded-xl skeleton" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-3xl skeleton skeleton-card h-[340px] sm:h-[380px]" />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl skeleton" />
              <div className="h-6 w-28 rounded skeleton" />
            </div>
            <div className="h-9 w-20 rounded-xl skeleton" />
          </div>
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="rounded-xl skeleton skeleton-card p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl skeleton" />
                <div className="w-12 h-12 rounded-xl skeleton skeleton-avatar" />
                <div className="flex-1">
                  <div className="h-4 w-24 rounded skeleton mb-2" />
                  <div className="h-3 w-16 rounded skeleton" />
                </div>
                <div className="h-5 w-20 rounded skeleton" />
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl skeleton" />
              <div className="h-6 w-36 rounded skeleton" />
            </div>
            <div className="h-9 w-20 rounded-xl skeleton" />
          </div>
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl skeleton skeleton-card p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl skeleton" />
                <div className="flex-1">
                  <div className="h-4 w-32 rounded skeleton mb-1" />
                  <div className="h-3 w-20 rounded skeleton" />
                </div>
                <div className="h-5 w-20 rounded skeleton" />
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm text-text-muted mb-1">Welcome back,</p>
          <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {user?.name}
          </h1>
        </div>
        <motion.div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary to-neon-purple flex items-center justify-center font-bold text-2xl shadow-xl shadow-primary/30 cursor-pointer"
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard/profile')}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </motion.div>
      </div>

      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950/80 to-slate-900" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-transparent to-indigo-900/30" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Sparkles size={16} className="text-black" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-amber-400/90 uppercase tracking-wider">Total Balance</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white drop-shadow-2xl tracking-tight">
                {formatCurrency(user?.balance ?? 0)}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Sparkles size={44} className="text-amber-400 drop-shadow-lg animate-pulse" />
                <div className="absolute inset-0 w-44 h-44 bg-amber-400/20 rounded-full blur-3xl animate-pulse" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
            <motion.div 
              className="relative group"
              whileHover={{ y: -2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-4 sm:p-5 bg-gradient-to-br from-emerald-900/40 to-teal-900/20 rounded-2xl backdrop-blur-xl border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Gift size={16} className="text-emerald-400" />
                  <p className="text-xs text-emerald-400/80 font-medium uppercase tracking-wider">Bonus</p>
                </div>
                <p className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
                  {formatCurrency(user?.bonusBalance ?? 0)}
                </p>
              </div>
            </motion.div>
            <motion.div 
              className="relative group"
              whileHover={{ y: -2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-4 sm:p-5 bg-gradient-to-br from-amber-900/40 to-orange-900/20 rounded-2xl backdrop-blur-xl border border-amber-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy size={16} className="text-amber-400" />
                  <p className="text-xs text-amber-400/80 font-medium uppercase tracking-wider">Winnings</p>
                </div>
                <p className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
                  {formatCurrency(user?.totalWinnings ?? 0)}
                </p>
              </div>
            </motion.div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button 
              className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-base cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 text-white border border-emerald-400/30 shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
              whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/dashboard/wallet')}
            >
              <Wallet size={20} />
              <span>Add Money</span>
            </motion.button>
            <motion.button 
              className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-base cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 text-white border border-indigo-400/30 shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
              whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/dashboard/withdraw')}
            >
              <ArrowUpRight size={20} />
              <span>Withdraw</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
        <motion.div className="premium-card rounded-2xl p-4 sm:p-6 text-center" whileHover={{ y: -4 }}>
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Gamepad2 size={24} className="text-primary" />
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-primary to-neon-purple bg-clip-text text-transparent mb-1">
            {user?.gamesPlayed ?? 0}
          </div>
          <div className="text-[10px] sm:text-xs text-text-muted font-medium uppercase tracking-wider">Games Played</div>
        </motion.div>
        <motion.div className="premium-card rounded-2xl p-4 sm:p-6 text-center" whileHover={{ y: -4 }}>
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 rounded-2xl bg-success/10 flex items-center justify-center">
            <Trophy size={24} className="text-success" />
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-success to-emerald-400 bg-clip-text text-transparent mb-1">
            {user?.gamesWon ?? 0}
          </div>
          <div className="text-[10px] sm:text-xs text-text-muted font-medium uppercase tracking-wider">Games Won</div>
        </motion.div>
        <motion.div className="premium-card rounded-2xl p-4 sm:p-6 text-center" whileHover={{ y: -4 }}>
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 rounded-2xl bg-warning/10 flex items-center justify-center">
            <Flame size={24} className="text-warning" />
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-warning to-amber-400 bg-clip-text text-transparent mb-1">
            {user?.streak ?? 0}
          </div>
          <div className="text-[10px] sm:text-xs text-text-muted font-medium uppercase tracking-wider">Win Streak</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-8">
        {[
          { icon: Gamepad2, label: 'Play', color: '#6366f1', path: '/dashboard/games' },
          { icon: Gift, label: 'Bonus', color: '#ef4444', path: '/dashboard/bonus' },
          { icon: TrendingUp, label: 'Stats', color: '#10b981', path: '/dashboard/achievements' },
          { icon: Trophy, label: 'Rank', color: '#f59e0b', path: '/dashboard/leaderboard' },
        ].map((action, index) => (
          <motion.div 
            key={index} 
            className="premium-card rounded-2xl p-4 sm:p-6 text-center cursor-pointer group"
            onClick={() => navigate(action.path)}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div 
              className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${action.color}15`, boxShadow: `0 0 20px ${action.color}20` }}
            >
              <action.icon size={22} style={{ color: action.color }} />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-text-secondary">{action.label}</span>
          </motion.div>
        ))}
      </div>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-12 h-12 rounded-2xl skeleton" />
            ) : (
              <div className="p-3 bg-gradient-to-br from-primary to-neon-purple rounded-2xl shadow-lg shadow-primary/30">
                <Gamepad2 size={24} className="text-white" />
              </div>
            )}
            <div>
              {loading ? (
                <div className="h-6 w-32 rounded skeleton mb-2" />
              ) : (
                <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Trending Games
                </h2>
              )}
              {loading ? (
                <div className="h-3 w-24 rounded skeleton" />
              ) : (
                <p className="text-xs text-text-muted">Most played this week</p>
              )}
            </div>
          </div>
          {loading ? (
            <div className="h-9 w-20 rounded-xl skeleton" />
          ) : (
            <motion.button 
              className="px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer bg-gradient-to-r from-primary/20 to-neon-purple/20 text-primary border border-primary/30 transition-all duration-300 hover:from-primary/30 hover:to-neon-purple/30 flex items-center gap-2"
              whileHover={{ scale: 1.05, x: 4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard/games')}
            >
              View All <ChevronRight size={16} />
            </motion.button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-3xl skeleton skeleton-card h-[340px] sm:h-[380px]" />
              ))}
            </>
          ) : (
            games.slice(0, 4).map((game, index) => (
            <motion.div
              key={game.id}
              className="relative rounded-3xl overflow-hidden cursor-pointer group h-[340px] sm:h-[380px]"
              onClick={() => navigate(`/dashboard/games/${game.id}`)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
              whileHover={{ y: -12, scale: 1.03 }}
            >
              <div className="absolute inset-0">
                <img 
                  src={game.image || `https://picsum.photos/seed/${game.id}/400/500`}
                  alt={game.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-120"
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-neon-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute inset-0 border border-white/10 rounded-3xl group-hover:border-primary/50 transition-colors duration-300" />
              
              {game.isHot && (
                <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-gradient-to-r from-danger via-red-500 to-orange-500 text-white text-[11px] font-extrabold flex items-center gap-2 shadow-2xl shadow-danger/50 animate-pulse z-20">
                  <Flame size={14} className="drop-shadow-lg" />
                  <span className="tracking-wider">TRENDING</span>
                </div>
              )}
              
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl text-white/90 text-[10px] font-bold uppercase tracking-widest border border-white/20">
                  {game.category || 'Gaming'}
                </span>
              </div>

              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-2xl border-2 border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-500 shadow-2xl shadow-white/20">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-neon-purple flex items-center justify-center">
                    <Play size={32} className="text-white ml-1 drop-shadow-lg" />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-primary/80 to-neon-purple/80 text-[9px] font-extrabold text-white uppercase tracking-widest backdrop-blur-sm">
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
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-white/80 text-xs font-semibold">
                      {game.players ? new Intl.NumberFormat('en-IN').format(game.players) : '10K'} Online
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/20 backdrop-blur-sm border border-success/30">
                    <TrendingUp size={14} className="text-success" />
                    <span className="text-success text-xs font-bold">PLAY NOW</span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-neon-purple to-warning opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute inset-0 rounded-3xl group-hover:shadow-2xl group-hover:shadow-primary/20 transition-shadow duration-500" />
            </motion.div>
            ))
          )}
        </div>
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-12 h-12 rounded-2xl skeleton" />
            ) : (
              <div className="p-2 bg-warning/10 rounded-xl">
                <Trophy size={20} className="text-warning" />
              </div>
            )}
            {loading ? (
              <div className="h-6 w-28 rounded skeleton" />
            ) : (
              <h2 className="text-lg font-bold flex items-center gap-3">
                Top Winners
              </h2>
            )}
          </div>
          {loading ? (
            <div className="h-9 w-20 rounded-xl skeleton" />
          ) : (
            <motion.button className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer bg-transparent text-text-secondary border border-white/10 transition-all duration-300 hover:bg-white/5 hover:text-white hover:border-primary/30 flex items-center gap-1" whileHover={{ x: 4 }} onClick={() => navigate('/dashboard/leaderboard')}>
              View All <ChevronRight size={14} />
            </motion.button>
          )}
        </div>
        <div className="flex flex-col gap-3">
          {loading ? (
            <>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="rounded-xl skeleton skeleton-card p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl skeleton" />
                  <div className="w-12 h-12 rounded-xl skeleton skeleton-avatar" />
                  <div className="flex-1">
                    <div className="h-4 w-24 rounded skeleton mb-2" />
                    <div className="h-3 w-16 rounded skeleton" />
                  </div>
                  <div className="h-5 w-20 rounded skeleton" />
                </div>
              ))}
            </>
          ) : (
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
          )}
        </div>
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold flex items-center gap-3">
            <span className="p-2 bg-primary/10 rounded-xl">
              <Wallet size={20} className="text-primary" />
            </span>
            Recent Transactions
          </h2>
          <motion.button className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer bg-transparent text-text-secondary border border-white/10 transition-all duration-300 hover:bg-white/5 hover:text-white hover:border-primary/30 flex items-center gap-1" whileHover={{ x: 4 }} onClick={() => navigate('/dashboard/wallet')}>
            View All <ChevronRight size={14} />
          </motion.button>
        </div>
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="rounded-xl skeleton skeleton-card p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl skeleton" />
                <div className="flex-1">
                  <div className="h-4 w-24 rounded skeleton mb-2" />
                  <div className="h-3 w-16 rounded skeleton" />
                </div>
                <div className="h-5 w-20 rounded skeleton" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="premium-card rounded-2xl p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-bg-card flex items-center justify-center">
              <Wallet size={36} className="text-text-muted" />
            </div>
            <h3 className="text-lg font-bold mb-2">No Transactions Yet</h3>
            <p className="text-sm text-text-muted">Your transaction history will appear here</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {transactions.map((tx, index) => {
              const { icon: Icon, bg, color } = getTransactionIcon(tx.type);
              return (
                <motion.div
                  key={tx.id}
                  className="premium-card rounded-xl p-4 flex items-center gap-4 transition-all duration-300 hover:border-primary/30"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  whileHover={{ x: 4 }}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                    <Icon size={24} className={color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm sm:text-base">{tx.type.replace('_', ' ')}</div>
                    <div className="text-xs text-text-muted">{new Date(tx.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className={`font-bold text-base shrink-0 ${tx.amount > 0 ? 'text-success' : 'text-danger'}`}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
