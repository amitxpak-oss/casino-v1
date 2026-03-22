import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, TrendingUp, Trophy, Gift, ArrowUpRight, ArrowDownRight, Gamepad2, ChevronRight, Users, Sparkles, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { walletService, gameService, leaderboardService } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [gamesRes, leaderboardRes, transactionsRes] = await Promise.all([
        gameService.getAll({ featured: true }),
        leaderboardService.getTop(5),
        walletService.getTransactions({ limit: 5 }),
      ]);
      setGames(gamesRes.data.games || []);
      setLeaderboard(leaderboardRes.data.leaders || []);
      setTransactions(transactionsRes.data.transactions || []);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-14 h-14 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
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

      <div className="relative overflow-hidden rounded-3xl p-8 mb-8 bg-gradient-to-br from-primary via-neon-purple to-purple-500 shadow-2xl shadow-primary/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_200%_50%,rgba(255,255,255,0.15)_0%,transparent_50%)] animate-shimmer" />
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/10 rounded-full blur-[100px]" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm opacity-90 font-medium mb-2 flex items-center gap-2">
                <Sparkles size={16} className="text-gold" />
                Total Balance
              </p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 drop-shadow-lg">
                {formatCurrency(user?.balance || 0)}
              </h2>
            </div>
            <Sparkles size={40} className="text-gold drop-shadow-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-black/20 rounded-2xl backdrop-blur-sm border border-white/10">
              <p className="text-xs opacity-80 mb-1">Bonus</p>
              <p className="text-xl sm:text-2xl font-bold">{formatCurrency(user?.bonusBalance || 0)}</p>
            </div>
            <div className="p-4 bg-black/20 rounded-2xl backdrop-blur-sm border border-white/10">
              <p className="text-xs opacity-80 mb-1">Winnings</p>
              <p className="text-xl sm:text-2xl font-bold">{formatCurrency(user?.totalWinnings || 0)}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button 
              className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-base cursor-pointer bg-white/15 backdrop-blur-md text-white border border-white/10 transition-all duration-300 hover:bg-white/25 hover:-translate-y-0.5 hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/dashboard/wallet')}
            >
              <Wallet size={20} />
              Add Money
            </motion.button>
            <motion.button 
              className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-base cursor-pointer bg-white/15 backdrop-blur-md text-white border border-white/10 transition-all duration-300 hover:bg-white/25 hover:-translate-y-0.5 hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/dashboard/withdraw')}
            >
              <ArrowUpRight size={20} />
              Withdraw
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
            {user?.gamesPlayed || 0}
          </div>
          <div className="text-[10px] sm:text-xs text-text-muted font-medium uppercase tracking-wider">Games Played</div>
        </motion.div>
        <motion.div className="premium-card rounded-2xl p-4 sm:p-6 text-center" whileHover={{ y: -4 }}>
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 rounded-2xl bg-success/10 flex items-center justify-center">
            <Trophy size={24} className="text-success" />
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-success to-emerald-400 bg-clip-text text-transparent mb-1">
            {user?.gamesWon || 0}
          </div>
          <div className="text-[10px] sm:text-xs text-text-muted font-medium uppercase tracking-wider">Games Won</div>
        </motion.div>
        <motion.div className="premium-card rounded-2xl p-4 sm:p-6 text-center" whileHover={{ y: -4 }}>
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 rounded-2xl bg-warning/10 flex items-center justify-center">
            <Flame size={24} className="text-warning" />
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-warning to-amber-400 bg-clip-text text-transparent mb-1">
            {user?.streak || 0}
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
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold flex items-center gap-3">
            <span className="p-2 bg-primary/10 rounded-xl">
              <Gamepad2 size={20} className="text-primary" />
            </span>
            Popular Games
          </h2>
          <motion.button className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer bg-transparent text-text-secondary border border-white/10 transition-all duration-300 hover:bg-white/5 hover:text-white hover:border-primary/30 flex items-center gap-1" whileHover={{ x: 4 }} onClick={() => navigate('/dashboard/games')}>
            View All <ChevronRight size={14} />
          </motion.button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {games.slice(0, 4).map((game, index) => (
            <motion.div
              key={game.id}
              className="premium-card rounded-2xl p-5 text-center cursor-pointer relative overflow-hidden group"
              onClick={() => navigate('/dashboard/games')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              {game.isHot && (
                <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-danger text-white text-[10px] font-bold flex items-center gap-1 shadow-lg shadow-danger/30 animate-pulse z-10">
                  <Flame size={10} /> HOT
                </div>
              )}
              <div 
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-black transition-transform group-hover:scale-110"
                style={{ backgroundColor: game.color || '#6366f1', boxShadow: `0 10px 30px ${game.color || '#6366f1'}40` }}
              >
                {game.icon || game.name?.charAt(0)}
              </div>
              <h3 className="text-sm sm:text-base font-bold mb-2">{game.name}</h3>
              <div className="text-[10px] text-text-muted flex items-center justify-center gap-1.5">
                <Users size={14} /> {game.players || 0} players
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold flex items-center gap-3">
            <span className="p-2 bg-warning/10 rounded-xl">
              <Trophy size={20} className="text-warning" />
            </span>
            Top Winners
          </h2>
          <motion.button className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer bg-transparent text-text-secondary border border-white/10 transition-all duration-300 hover:bg-white/5 hover:text-white hover:border-primary/30 flex items-center gap-1" whileHover={{ x: 4 }} onClick={() => navigate('/dashboard/leaderboard')}>
            View All <ChevronRight size={14} />
          </motion.button>
        </div>
        <div className="flex flex-col gap-3">
          {leaderboard.slice(0, 5).map((player, index) => (
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
                {formatCurrency(player.totalWinnings || 0)}
              </div>
            </motion.div>
          ))}
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
        {transactions.length === 0 ? (
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
