import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { startTransition, StrictMode } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModalProvider } from './context/AuthModalContext';
import AppLayout from './components/AppLayout';
import AuthModal from './components/AuthModal';
import LoginRequired from './components/LoginRequired';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Games from './pages/Games';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';
import Achievements from './pages/Achievements';
import Leaderboard from './pages/Leaderboard';
import Notifications from './pages/Notifications';
import Bonus from './pages/Bonus';
import Withdraw from './pages/Withdraw';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminWithdrawals from './pages/AdminWithdrawals';
import AdminSubadmins from './pages/AdminSubadmins';
import GamePlay from './pages/GamePlay';

const ProtectedRoute = ({ children, adminOnly = false, title, message }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#0a0a14'
      }}>
        <div className="loading-spinner" />
      </div>
    );
  }
  
  if (!user) {
    return <LoginRequired title={title} message={message} />;
  }

  if (adminOnly && user.role === 'USER') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const HomeRedirect = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#0a0a14'
      }}>
        <div className="loading-spinner" />
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#0a0a14'
      }}>
        <div className="loading-spinner" />
      </div>
    );
  }
  
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'SUB_ADMIN')) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={
          <HomeRedirect>
            <Home />
          </HomeRedirect>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute title="Welcome Back!" message="Sign in to access your dashboard and continue winning">
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/games" element={
          <ProtectedRoute title="Unlock Premium Games" message="Login to play exciting games and win big prizes">
            <Games />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/wallet" element={
          <ProtectedRoute title="Access Your Wallet" message="Login to manage your funds and transactions">
            <Wallet />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/profile" element={
          <ProtectedRoute title="View Your Profile" message="Login to see your profile and settings">
            <Profile />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/achievements" element={
          <ProtectedRoute title="Your Achievements" message="Login to view your achievements and milestones">
            <Achievements />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/leaderboard" element={<Leaderboard />} />
        
        <Route path="/dashboard/notifications" element={
          <ProtectedRoute title="Stay Updated" message="Login to view your notifications">
            <Notifications />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/bonus" element={
          <ProtectedRoute title="Claim Your Bonus" message="Login to claim exciting bonuses and rewards">
            <Bonus />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/withdraw" element={
          <ProtectedRoute title="Withdraw Your Winnings" message="Login to withdraw your earnings">
            <Withdraw />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/admin" element={
          <ProtectedRoute title="Admin Access Required" message="You need admin privileges to access this area">
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/admin/users" element={
          <ProtectedRoute title="Admin Access Required" message="You need admin privileges to access this area">
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/admin/withdrawals" element={
          <ProtectedRoute title="Admin Access Required" message="You need admin privileges to access this area">
            <AdminRoute>
              <AdminWithdrawals />
            </AdminRoute>
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/admin/subadmins" element={
          <ProtectedRoute title="Super Admin Only" message="Only Super Admins can access this area">
            <AdminRoute>
              <AdminSubadmins />
            </AdminRoute>
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/games/:id" element={
          <ProtectedRoute title="Start Playing" message="Login to play this game and win exciting rewards">
            <GamePlay />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthModalProvider>
          <AppRoutes />
          <AuthModal />
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#13131f',
                color: '#fff',
                border: '1px solid #2d2d4a',
                borderRadius: '12px',
              },
              success: {
                iconTheme: { primary: '#10b981', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' },
              },
            }}
          />
        </AuthModalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
