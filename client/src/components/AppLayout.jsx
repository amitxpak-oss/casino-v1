import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Home, Gamepad2, Wallet, User, Trophy, Bell, Gift, Medal, Zap, LogOut, Crown, Sparkles, Shield, Users, DollarSign, Settings, LayoutDashboard, BarChart3, CreditCard, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import { notificationService } from '../services/api';
import { useState, useEffect } from 'react';

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { openLogin } = useAuthModal();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  const isAdmin = user?.role === 'SUB_ADMIN' || user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Failed to fetch unread count');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const currentHomeItem = user ? { path: isAdmin ? '/dashboard/admin' : '/dashboard' } : { path: '/' };

  // Admin Sidebar
  const AdminSidebar = () => (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 w-[280px] h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black z-50 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.15)_0%,transparent_70%)]" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500" />
      
      <div className="relative z-10 p-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <motion.div 
            className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(currentHomeItem.path)}
            style={{ cursor: 'pointer' }}
          >
            <Shield size={24} color="white" />
          </motion.div>
          <div>
            <span className="text-xl font-black text-white tracking-tight">Admin Panel</span>
            <p className="text-[10px] text-amber-400/80 uppercase tracking-widest font-medium">
              {user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Sub Admin'}
            </p>
          </div>
        </div>
      </div>

      <nav className="relative z-10 flex-1 p-4 overflow-y-auto scrollbar-hide">
        <div className="text-[10px] font-bold text-amber-400/80 uppercase tracking-[0.2em] px-4 mb-3">Management</div>
        
        {[
          { path: '/dashboard/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
          { path: '/dashboard/admin/users', icon: Users, label: 'Users', exact: true },
          { path: '/dashboard/admin/withdrawals', icon: DollarSign, label: 'Withdrawals', exact: true },
          ...(user?.role === 'SUPER_ADMIN' ? [{ path: '/dashboard/admin/subadmins', icon: Shield, label: 'Sub-Admins' }] : []),
        ].map((item) => (
          <motion.div key={item.path} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
            <NavLink
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-xl text-[14px] font-medium no-underline transition-all duration-300 mb-1.5 relative group ${isActive ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-400' : 'text-gray-400 hover:text-amber-400 hover:bg-white/5'}`}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <>
                      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent" />
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-amber-400 rounded-l-full shadow-lg shadow-amber-400/50" />
                    </>
                  )}
                  <span className={`relative z-10 p-1.5 rounded-lg ${isActive ? 'bg-amber-500/20' : 'bg-white/5 group-hover:bg-amber-500/10'} transition-all`}>
                    <item.icon size={18} />
                  </span>
                  <span className="relative z-10 font-semibold">{item.label}</span>
                </>
              )}
            </NavLink>
          </motion.div>
        ))}

        <div className="text-[10px] font-bold text-gray-500/80 uppercase tracking-[0.2em] px-4 mt-6 mb-3">Quick Stats</div>
        
        {[
          { label: 'Total Users', value: '2,450', color: 'text-blue-400' },
          { label: 'Pending Withdraw', value: '₹45,000', color: 'text-red-400' },
        ].map((stat) => (
          <div key={stat.label} className="px-4 py-3 mb-1">
            <div className="text-[10px] text-gray-500 mb-0.5">{stat.label}</div>
            <div className={`text-sm font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </nav>

      <div className="relative z-10 p-4 border-t border-white/10">
        <motion.div 
          className="p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-xl mb-4 border border-amber-500/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-white truncate">{user?.name}</div>
              <div className="text-[10px] text-amber-400 capitalize">{user?.role?.toLowerCase().replace('_', ' ')}</div>
            </div>
          </div>
        </motion.div>

        <motion.button 
          onClick={handleLogout} 
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-red-400 font-semibold text-[13px] bg-red-500/10 border border-red-500/20 transition-all duration-300 hover:bg-red-500/20"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </motion.button>
      </div>
    </aside>
  );

  // User Sidebar
  const UserSidebar = () => (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 w-[280px] h-screen bg-gradient-to-br from-bg-card via-bg-card to-bg-dark z-50 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.12)_0%,transparent_70%)]" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-neon-purple to-primary animate-gradient" />
      
      <div className="relative z-10 p-7 border-b border-white/5">
        <div className="flex items-center gap-4">
          <motion.div 
            className="w-14 h-14 bg-gradient-to-br from-primary to-neon-purple rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 animate-pulse-glow"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(currentHomeItem.path)}
            style={{ cursor: 'pointer' }}
          >
            <Crown size={28} color="white" />
          </motion.div>
          <div>
            <span className="text-2xl font-black bg-gradient-to-r from-white via-primary-light to-white bg-clip-text text-transparent tracking-tight">
              IndiaPlay
            </span>
            <p className="text-[10px] text-primary-light/60 uppercase tracking-widest">Premium Gaming</p>
          </div>
        </div>
      </div>

      <nav className="relative z-10 flex-1 p-4 overflow-y-auto scrollbar-hide">
        <div className="text-[10px] font-bold text-text-muted/60 uppercase tracking-[0.2em] px-4 mb-3">Main Menu</div>
        
        {[
          { path: '/', icon: Home, label: 'Home', exact: true },
          { path: '/dashboard/games', icon: Gamepad2, label: 'Games' },
          { path: '/dashboard/wallet', icon: Wallet, label: 'Wallet' },
          { path: '/dashboard/leaderboard', icon: Medal, label: 'Leaderboard' },
          { path: '/dashboard/profile', icon: User, label: 'Profile' },
        ].map((item) => (
          <motion.div key={item.path} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
            <NavLink
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `flex items-center gap-4 px-4 py-3.5 rounded-xl text-[15px] font-medium no-underline transition-all duration-300 mb-1.5 relative group ${isActive ? 'bg-gradient-to-r from-primary to-neon-purple text-white shadow-lg shadow-primary/20' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <>
                      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-transparent" />
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full shadow-lg shadow-white/30" />
                    </>
                  )}
                  <span className={`relative z-10 p-1.5 rounded-lg ${isActive ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'} transition-all`}>
                    <item.icon size={20} />
                  </span>
                  <span className="relative z-10 font-semibold">{item.label}</span>
                </>
              )}
            </NavLink>
          </motion.div>
        ))}

        <div className="text-[10px] font-bold text-text-muted/60 uppercase tracking-[0.2em] px-4 mt-8 mb-3">More</div>
        
        {[
          { path: '/dashboard/bonus', icon: Gift, label: 'Bonus' },
          { path: '/dashboard/withdraw', icon: Zap, label: 'Withdraw' },
          { path: '/dashboard/achievements', icon: Trophy, label: 'Achievements' },
          { path: '/dashboard/notifications', icon: Bell, label: 'Notifications', badge: unreadCount },
        ].map((item) => (
          <motion.div key={item.path} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
            <NavLink
              to={item.path}
              className={({ isActive }) => `flex items-center gap-4 px-4 py-3.5 rounded-xl text-[15px] font-medium no-underline transition-all duration-300 mb-1.5 relative group ${isActive ? 'bg-gradient-to-r from-primary to-neon-purple text-white shadow-lg shadow-primary/20' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-transparent" />
                  )}
                  <span className={`relative z-10 p-1.5 rounded-lg ${isActive ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'} transition-all flex items-center gap-2`}>
                    <item.icon size={20} />
                    <span className="font-semibold">{item.label}</span>
                  </span>
                  {item.badge > 0 && (
                    <span className="relative z-10 ml-auto px-2.5 py-1 bg-danger text-white text-[10px] font-bold rounded-full shadow-lg shadow-danger/30 animate-pulse">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <div className="relative z-10 p-4 border-t border-white/5">
        {user ? (
          <>
            <motion.div 
              className="p-4 bg-gradient-to-br from-white/5 to-transparent rounded-2xl mb-4 border border-white/5 backdrop-blur-sm cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate('/dashboard/profile')}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-neon-purple flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[15px] truncate">{user?.name}</div>
                  <div className="text-[11px] text-primary-light capitalize font-medium">{user?.role?.toLowerCase()}</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              </div>
            </motion.div>

            <motion.div 
              className="relative p-5 bg-gradient-to-br from-primary/15 to-neon-purple/10 rounded-2xl mb-4 border border-primary/20 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
              <Sparkles size={16} className="absolute top-4 right-4 text-gold animate-pulse" />
              <div className="relative z-10">
                <div className="text-[10px] text-text-muted/80 font-bold uppercase tracking-wider mb-1.5">Total Balance</div>
                <div className="text-2xl font-black bg-gradient-to-r from-primary to-neon-purple bg-clip-text text-transparent">
                  {formatCurrency(user?.balance)}
                </div>
              </div>
            </motion.div>

            <motion.button 
              onClick={handleLogout} 
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl text-danger font-semibold text-[14px] bg-danger/5 border border-danger/10 transition-all duration-300 hover:bg-danger/10 hover:border-danger/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </motion.button>
          </>
        ) : (
          <div className="text-center p-5">
            <p className="text-text-muted/80 text-sm mb-4">
              Sign in to unlock all features
            </p>
            <motion.button 
              className="w-full py-4 px-6 rounded-xl font-bold text-base cursor-pointer bg-gradient-to-r from-primary to-neon-purple text-white shadow-xl shadow-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-0.5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openLogin}
            >
              Sign In
            </motion.button>
          </div>
        )}
      </div>
    </aside>
  );

  // Mobile Bottom Nav - Admin
  const AdminBottomNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-amber-500/30 px-2 py-2 flex justify-around items-center z-50 lg:hidden shadow-[0_-10px_40px_rgba(245,158,11,0.15)]">
      {[
        { path: '/dashboard/admin', icon: LayoutDashboard, label: 'Home' },
        { path: '/dashboard/admin/users', icon: Users, label: 'Users' },
        { path: '/dashboard/admin/withdrawals', icon: DollarSign, label: 'Withdraw' },
        { path: '/dashboard/profile', icon: User, label: 'Profile' },
      ].map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `flex flex-col items-center justify-center gap-1 p-2 rounded-xl no-underline transition-all duration-300 flex-1 max-w-[80px] relative ${isActive ? 'text-amber-400' : 'text-gray-500'}`}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute inset-0 bg-amber-500/10 rounded-xl" />
              )}
              <span className={`relative z-10 p-1.5 rounded-lg ${isActive ? 'bg-amber-500/20' : ''} transition-all`}>
                <item.icon size={22} className={isActive ? 'drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : ''} />
              </span>
              <span className={`relative z-10 text-[10px] font-bold ${isActive ? 'text-amber-400' : ''}`}>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );

  // Mobile Bottom Nav - User
  const UserBottomNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-dark/95 backdrop-blur-xl border-t border-white/10 px-2 py-2 flex justify-around items-center z-50 lg:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      {[
        { path: '/', icon: Home, label: 'Home', exact: true },
        { path: '/dashboard/games', icon: Gamepad2, label: 'Games' },
        { path: '/dashboard/wallet', icon: Wallet, label: 'Wallet' },
        { path: '/dashboard/leaderboard', icon: Medal, label: 'Rank' },
        { path: '/dashboard/profile', icon: User, label: 'Profile' },
      ].map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.exact}
          className={({ isActive }) => `flex flex-col items-center justify-center gap-1 p-2 rounded-xl no-underline transition-all duration-300 flex-1 max-w-[72px] relative ${isActive ? 'text-primary' : 'text-text-muted'}`}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute inset-0 bg-primary/10 rounded-xl" />
              )}
              <span className={`relative z-10 p-1.5 rounded-lg ${isActive ? 'bg-primary/20' : ''} transition-all`}>
                <item.icon size={24} className={isActive ? 'drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : ''} />
              </span>
              <span className={`relative z-10 text-[10px] font-bold ${isActive ? 'text-primary' : ''}`}>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-bg-dark">
      {isAdmin ? <AdminSidebar /> : <UserSidebar />}

      <div className="flex-1 lg:ml-[280px] flex flex-col min-h-screen w-0">
        <header className="sticky top-0 z-40 bg-bg-dark/80 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div 
              className={`flex items-center gap-2 text-lg font-black cursor-pointer lg:hidden ${isAdmin ? 'text-amber-400' : 'bg-gradient-to-r from-primary to-neon-purple bg-clip-text text-transparent'}`}
              onClick={() => navigate(currentHomeItem.path)}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isAdmin ? 'bg-amber-500' : 'bg-gradient-to-br from-primary to-neon-purple'}`}>
                {isAdmin ? <Shield size={16} color="white" /> : <Crown size={16} color="white" />}
              </div>
              <span>{isAdmin ? 'Admin' : 'IndiaPlay'}</span>
            </div>
            {user && !isAdmin && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg border border-primary/20 backdrop-blur-sm">
                <Wallet size={14} className="text-primary" />
                <span className="font-bold text-sm bg-gradient-to-r from-primary to-neon-purple bg-clip-text text-transparent">
                  {formatCurrency(user?.balance)}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <NavLink to="/dashboard/notifications" className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary no-underline transition-all duration-300 hover:bg-primary/10 hover:text-primary hover:border-primary/30 group">
                    <Bell size={20} className="group-hover:scale-110 transition-transform" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-danger/30 animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </NavLink>
                </motion.div>
                <motion.div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base cursor-pointer shadow-lg transition-all duration-300 hover:scale-105 ${isAdmin ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/20' : 'bg-gradient-to-br from-primary to-neon-purple shadow-primary/20'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/dashboard/profile')}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </motion.div>
              </>
            ) : (
              <motion.button 
                className="py-2.5 px-5 rounded-xl font-semibold text-sm cursor-pointer bg-gradient-to-r from-primary to-neon-purple text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={openLogin}
              >
                Sign In
              </motion.button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-hidden py-4 sm:py-6 px-4 sm:px-6 lg:px-8 pb-24 sm:pb-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full animate-slide-up"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {isAdmin ? <AdminBottomNav /> : <UserBottomNav />}
    </div>
  );
};

export default AppLayout;
