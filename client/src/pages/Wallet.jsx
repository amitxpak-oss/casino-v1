import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, ArrowDownRight, ArrowUpRight, Gift, History, Copy, Check, Sparkles, CreditCard, Building2, Smartphone, TrendingUp, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { walletService } from '../services/api';
import toast from 'react-hot-toast';

const WalletPage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('deposit');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [amount, setAmount] = useState('');
  const [bonusCode, setBonusCode] = useState('');
  const [copied, setCopied] = useState('');

  useEffect(() => {
    if (activeTab === 'history') fetchTransactions();
  }, [activeTab]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await walletService.getTransactions({ page: 1, limit: 20 });
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) { toast.error('Please enter a valid amount'); return; }
    setLoading(true);
    try {
      const response = await walletService.deposit({ amount: parseFloat(amount), bonusCode: bonusCode || undefined });
      updateUser({ balance: response.data.balance, bonusBalance: response.data.bonusBalance });
      toast.success('Deposit successful!');
      setShowModal(false);
      setAmount('');
      setBonusCode('');
      fetchTransactions();
      setActiveTab('history');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) { toast.error('Please enter a valid amount'); return; }
    if (parseFloat(amount) > user?.bonusBalance) { toast.error('Insufficient bonus balance'); return; }
    setLoading(true);
    try {
      const response = await walletService.transfer({ amount: parseFloat(amount) });
      updateUser({ balance: response.data.balance, bonusBalance: response.data.bonusBalance });
      toast.success('Transfer successful!');
      setShowModal(false);
      setAmount('');
      fetchTransactions();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success(`${type} copied!`);
    setTimeout(() => setCopied(''), 2000);
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount || 0);

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'DEPOSIT': return { icon: ArrowDownRight, bg: 'bg-success/10', color: 'text-success' };
      case 'WITHDRAW': return { icon: ArrowUpRight, bg: 'bg-danger/10', color: 'text-danger' };
      case 'BONUS': return { icon: Gift, bg: 'bg-primary/10', color: 'text-primary' };
      case 'WINNING':
      case 'GAME_WIN': return { icon: TrendingUp, bg: 'bg-warning/10', color: 'text-warning' };
      default: return { icon: Wallet, bg: 'bg-primary/10', color: 'text-primary' };
    }
  };

  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-[1400px] mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-1">
            Wallet
          </h1>
          <p className="text-sm text-text-muted">Manage your funds</p>
        </div>
      </div>

      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl p-8 mb-6 bg-gradient-to-br from-primary via-neon-purple to-purple-500 shadow-2xl shadow-primary/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_200%_50%,rgba(255,255,255,0.15)_0%,transparent_50%)] animate-shimmer" />
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/10 rounded-full blur-[100px]" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm opacity-90 font-medium mb-2 flex items-center gap-2">
                <Sparkles size={16} className="text-gold" />
                Main Balance
              </p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black drop-shadow-lg">
                {formatCurrency(user?.balance)}
              </h2>
            </div>
            <Sparkles size={40} className="text-gold drop-shadow-lg animate-pulse" />
          </div>
          <div className="p-5 bg-black/20 rounded-2xl mb-6 backdrop-blur-sm border border-white/10">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs opacity-80 mb-1">Bonus Balance</p>
                <p className="text-xl sm:text-2xl font-bold">{formatCurrency(user?.bonusBalance)}</p>
              </div>
              <motion.button 
                className="py-2.5 px-5 rounded-xl font-semibold text-sm cursor-pointer bg-white/15 text-white border border-white/10 transition-all duration-300 hover:bg-white/25 flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setModalType('transfer'); setShowModal(true); }}
              >
                <ArrowUpRight size={16} /> Transfer
              </motion.button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button 
              className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-base cursor-pointer bg-white/15 backdrop-blur-md text-white border border-white/10 transition-all duration-300 hover:bg-white/25 hover:-translate-y-0.5 hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setModalType('deposit'); setShowModal(true); }}
            >
              <ArrowDownRight size={20} />
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
      </motion.div>

      {user?.referralCode && (
        <motion.div variants={itemVariants} className="premium-card rounded-2xl p-5 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-text-muted/80 font-bold uppercase tracking-wider mb-1">Your Referral Code</p>
              <p className="text-xl sm:text-2xl font-black bg-gradient-to-r from-primary to-neon-purple bg-clip-text text-transparent tracking-[0.3em]">
                {user.referralCode}
              </p>
            </div>
            <motion.button 
              className="p-3 rounded-xl bg-white/5 text-text-secondary border border-white/10 transition-all duration-300 hover:bg-white/10 hover:text-primary hover:border-primary/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => copyToClipboard(user.referralCode, 'Referral code')}
            >
              {copied === 'Referral code' ? <Check size={20} className="text-success" /> : <Copy size={20} />}
            </motion.button>
          </div>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <motion.button 
          className={`py-3 px-6 rounded-xl font-bold text-sm whitespace-nowrap cursor-pointer transition-all duration-300 flex items-center gap-2 ${activeTab === 'deposit' ? 'bg-gradient-to-r from-primary to-neon-purple text-white shadow-lg shadow-primary/30' : 'bg-white/5 text-text-muted border border-white/10 hover:bg-white/10 hover:text-white'}`}
          onClick={() => setActiveTab('deposit')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowDownRight size={16} /> Deposit
        </motion.button>
        <motion.button 
          className={`py-3 px-6 rounded-xl font-bold text-sm whitespace-nowrap cursor-pointer transition-all duration-300 flex items-center gap-2 ${activeTab === 'history' ? 'bg-gradient-to-r from-primary to-neon-purple text-white shadow-lg shadow-primary/30' : 'bg-white/5 text-text-muted border border-white/10 hover:bg-white/10 hover:text-white'}`}
          onClick={() => setActiveTab('history')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <History size={16} /> History
        </motion.button>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 'deposit' && (
          <motion.div
            key="deposit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <motion.div variants={itemVariants} className="premium-card rounded-2xl p-6 mb-4">
              <h3 className="font-bold text-lg mb-5 flex items-center gap-3">
                <span className="p-2 bg-primary/10 rounded-xl">
                  <CreditCard size={20} className="text-primary" />
                </span>
                Quick Add
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-6">
                {quickAmounts.map((amt) => (
                  <motion.button
                    key={amt}
                    className="py-3 px-4 rounded-xl font-semibold text-sm cursor-pointer bg-white/5 text-text-secondary border border-white/10 transition-all duration-300 hover:border-primary hover:text-primary"
                    whileHover={{ scale: 1.05, borderColor: 'var(--color-primary)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setAmount(amt.toString()); setModalType('deposit'); setShowModal(true); }}
                  >
                    ₹{amt.toLocaleString()}
                  </motion.button>
                ))}
              </div>
              <div className="p-6 bg-gradient-to-br from-primary/10 to-neon-purple/5 rounded-2xl border-2 border-dashed border-primary/30">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                    <Gift size={26} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Have a Bonus Code?</h4>
                    <p className="text-sm text-text-muted">Claim extra bonus on your deposit</p>
                  </div>
                </div>
                <motion.button 
                  className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm cursor-pointer bg-gradient-to-r from-primary to-neon-purple text-white shadow-lg shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/dashboard/bonus')}
                >
                  <Sparkles size={18} /> Claim Bonus
                </motion.button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="premium-card rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-5">Payment Methods</h3>
              <div className="flex flex-col gap-3">
                {[
                  { icon: Smartphone, name: 'UPI', desc: 'Instant payment via UPI apps' },
                  { icon: Building2, name: 'Bank Transfer', desc: 'Direct bank transfer' },
                  { icon: CreditCard, name: 'Card Payment', desc: 'Credit/Debit card payment' },
                ].map((method, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-bg-card border border-white/5 rounded-xl cursor-pointer transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 group"
                    whileHover={{ x: 4 }}
                    onClick={() => { setModalType('deposit'); setShowModal(true); }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <method.icon size={24} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{method.name}</div>
                      <div className="text-xs text-text-muted">{method.desc}</div>
                    </div>
                    <ChevronRight size={20} className="text-text-muted" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-14 h-14 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="premium-card rounded-2xl p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-bg-card flex items-center justify-center border border-white/5">
                  <History size={40} className="text-text-muted" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Transactions</h3>
                <p className="text-sm text-text-muted">Your transaction history will appear here</p>
              </div>
            ) : (
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                {transactions.map((tx, index) => {
                  const { icon: Icon, bg, color } = getTransactionIcon(tx.type);
                  return (
                    <motion.div
                      key={tx.id}
                      variants={itemVariants}
                      className="premium-card rounded-xl p-4 mb-3 transition-all duration-300 hover:border-primary/30"
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                          <Icon size={24} className={color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold">{tx.type.replace('_', ' ')}</div>
                          <div className="text-xs text-text-muted">{new Date(tx.createdAt).toLocaleString()}</div>
                        </div>
                        <div className={`font-bold text-base shrink-0 ${tx.amount > 0 ? 'text-success' : 'text-danger'}`}>
                          {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="w-full max-w-md premium-card rounded-3xl p-8 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-7">
                <h2 className="text-xl font-black flex items-center gap-3">
                  {modalType === 'deposit' ? (
                    <>
                      <ArrowDownRight size={24} className="text-success" />
                      Add Money
                    </>
                  ) : (
                    <>
                      <ArrowUpRight size={24} className="text-primary" />
                      Transfer to Main
                    </>
                  )}
                </h2>
                <motion.button 
                  className="p-2 rounded-xl bg-white/5 text-text-secondary border border-white/10 transition-all duration-300 hover:bg-white/10 hover:text-white"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowModal(false)}
                >
                  ✕
                </motion.button>
              </div>
              <form onSubmit={modalType === 'deposit' ? handleDeposit : handleTransfer}>
                <div className="mb-5">
                  <label className="block text-sm font-bold text-text-secondary mb-2.5">Amount</label>
                  <input 
                    type="number" 
                    className="w-full py-4 px-4 bg-black/30 border-2 border-white/10 rounded-2xl text-white text-lg font-bold transition-all duration-300 focus:outline-none focus:border-primary" 
                    placeholder="Enter amount" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    min="1" 
                    required 
                  />
                </div>
                {modalType === 'deposit' && (
                  <div className="mb-5">
                    <label className="block text-sm font-bold text-text-secondary mb-2.5">Bonus Code (Optional)</label>
                    <input 
                      type="text" 
                      className="w-full py-4 px-4 bg-black/30 border-2 border-white/10 rounded-2xl text-white text-base font-bold uppercase tracking-wider transition-all duration-300 focus:outline-none focus:border-primary" 
                      placeholder="Enter bonus code" 
                      value={bonusCode} 
                      onChange={(e) => setBonusCode(e.target.value.toUpperCase())}
                    />
                  </div>
                )}
                {modalType === 'transfer' && (
                  <p className="text-sm text-text-muted mb-5 p-4 bg-primary/10 rounded-xl border border-primary/20">
                    Available Bonus: <strong className="text-primary">{formatCurrency(user?.bonusBalance)}</strong>
                  </p>
                )}
                <motion.button 
                  type="submit" 
                  className="w-full py-4 px-6 rounded-2xl font-bold text-base cursor-pointer bg-gradient-to-r from-primary to-neon-purple text-white shadow-lg shadow-primary/30 transition-all duration-300 disabled:opacity-50"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <div className="w-6 h-6 mx-auto border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>{modalType === 'deposit' ? 'Deposit' : 'Transfer'} {amount && `₹${parseFloat(amount).toLocaleString()}`}</>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WalletPage;
