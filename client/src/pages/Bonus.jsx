import { useState, useEffect } from 'react';
import { Gift, Tag, Clock, ArrowRight, Users, Percent, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { bonusService } from '../services/api';
import toast from 'react-hot-toast';

const Bonus = () => {
  const [bonuses, setBonuses] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [referralStats, setReferralStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');
  const [codeInput, setCodeInput] = useState('');
  const [claiming, setClaiming] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [bonusesRes, claimsRes, referralRes] = await Promise.all([
        bonusService.getAll(),
        bonusService.getMy(),
        bonusService.getReferral(),
      ]);
      setBonuses(bonusesRes.data.bonuses || []);
      setMyClaims(claimsRes.data.claims || []);
      setReferralStats(referralRes.data);
    } catch (error) {
      console.error('Failed to fetch bonuses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimCode = async (e) => {
    e.preventDefault();
    if (!codeInput.trim()) { toast.error('Please enter a bonus code'); return; }
    setClaiming(true);
    try {
      const response = await bonusService.claim(codeInput.trim().toUpperCase());
      toast.success(`Bonus claimed! You received ₹${response.data.amount}`);
      setCodeInput('');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid or expired bonus code');
    } finally {
      setClaiming(false);
    }
  };

  const handleClaimBonus = async (bonusId) => {
    try {
      const bonus = bonuses.find(b => b.id === bonusId);
      if (!bonus) return;
      const response = await bonusService.claim(bonus.code);
      toast.success(`Bonus claimed! You received ₹${response.data.amount}`);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to claim bonus');
    }
  };

  const getTypeColor = (type) => {
    const colors = { WELCOME: '#6366f1', DAILY: '#f59e0b', DEPOSIT: '#10b981', CASHBACK: '#8b5cf6', REFER: '#ef4444', PROMO: '#06b6d4' };
    return colors[type] || '#6366f1';
  };

  const formatDate = (date) => date ? new Date(date).toLocaleDateString() : 'No expiry';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-3 border-primary/10 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6 sm:mb-7">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Bonuses & Offers</h1>
          <p className="text-sm sm:text-base text-text-muted mt-1">Claim exciting rewards</p>
        </div>
      </div>

      <motion.div 
        variants={itemVariants} 
        className="relative overflow-hidden rounded-2xl p-5 mb-6 bg-gradient-to-br from-primary/20 to-neon-purple/15 border border-primary/20"
      >
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <h3 className="font-bold mb-4 flex items-center gap-2.5 relative z-10">
          <Tag size={22} className="text-primary" />
          Enter Bonus Code
        </h3>
        <form onSubmit={handleClaimCode} className="relative z-10">
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              className="flex-1 py-4 px-4 bg-black/30 border-2 border-white/10 rounded-xl text-white text-sm font-bold uppercase tracking-wider transition-all duration-300 focus:outline-none focus:border-primary" 
              placeholder="Enter code (e.g., WELCOME100)" 
              value={codeInput} 
              onChange={(e) => setCodeInput(e.target.value.toUpperCase())} 
            />
            <motion.button 
              type="submit" 
              className="py-4 px-6 rounded-xl font-semibold text-sm cursor-pointer bg-gradient-to-r from-primary to-neon-purple text-white shadow-lg shadow-primary/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={claiming}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {claiming ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Claim <ArrowRight size={18} /></>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {referralStats && (
        <motion.div variants={itemVariants} className="bg-gradient-to-b from-bg-card-hover to-bg-card border border-white/5 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-danger/15 flex items-center justify-center shrink-0">
              <Users size={30} className="text-danger" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold mb-1">Refer & Earn</h3>
              <p className="text-sm text-text-muted">
                Your code: <strong className="text-primary tracking-wider">{referralStats.referralCode}</strong>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-4 bg-bg-dark rounded-xl">
              <p className="text-xl font-extrabold text-primary mb-1">{referralStats.totalReferrals || 0}</p>
              <p className="text-xs text-text-muted">Referrals</p>
            </div>
            <div className="text-center p-4 bg-bg-dark rounded-xl">
              <p className="text-xl font-extrabold text-success mb-1">₹{referralStats.totalEarned || 0}</p>
              <p className="text-xs text-text-muted">Earned</p>
            </div>
            <div className="text-center p-4 bg-bg-dark rounded-xl">
              <p className="text-xl font-extrabold text-warning mb-1">₹{referralStats.pendingBonus || 0}</p>
              <p className="text-xs text-text-muted">Pending</p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="flex gap-2.5 mb-6 overflow-x-auto pb-1">
        <motion.button 
          className={`py-3 px-5 rounded-xl font-semibold text-sm whitespace-nowrap cursor-pointer transition-all duration-300 ${activeTab === 'available' ? 'bg-gradient-to-r from-primary to-neon-purple text-white shadow-lg shadow-primary/30' : 'bg-white/5 text-text-muted border border-white/5 hover:bg-white/10 hover:text-white'}`}
          onClick={() => setActiveTab('available')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Available ({bonuses.length})
        </motion.button>
        <motion.button 
          className={`py-3 px-5 rounded-xl font-semibold text-sm whitespace-nowrap cursor-pointer transition-all duration-300 ${activeTab === 'claimed' ? 'bg-gradient-to-r from-primary to-neon-purple text-white shadow-lg shadow-primary/30' : 'bg-white/5 text-text-muted border border-white/5 hover:bg-white/10 hover:text-white'}`}
          onClick={() => setActiveTab('claimed')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          My Claims ({myClaims.length})
        </motion.button>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 'available' && (
          <motion.div
            key="available"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {bonuses.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-bg-card border border-white/5 flex items-center justify-center">
                  <Gift size={40} className="text-text-muted" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Bonuses Available</h3>
                <p className="text-sm text-text-muted">Check back later for new offers</p>
              </div>
            ) : (
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                {bonuses.map((bonus) => (
                  <motion.div
                    key={bonus.id}
                    variants={itemVariants}
                    className="bg-gradient-to-b from-bg-card-hover to-bg-card border border-white/5 rounded-2xl p-5 mb-4 transition-all duration-300 hover:-translate-y-1"
                    whileHover={{ y: -4, borderColor: `${getTypeColor(bonus.type)}40` }}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                      <div className="flex-1">
                        <span className="inline-block px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-bold uppercase mb-3">
                          {bonus.type}
                        </span>
                        <h3 className="font-bold mb-2 text-lg">{bonus.title}</h3>
                        <p className="text-sm text-text-muted">{bonus.description}</p>
                      </div>
                      <div className="text-right p-4 bg-bg-dark rounded-xl min-w-[100px] shrink-0">
                        <p className="text-2xl font-extrabold text-success mb-1">₹{bonus.reward}</p>
                        {bonus.percentage && (
                          <p className="text-xs text-text-muted flex items-center justify-end gap-1">
                            <Percent size={12} />{bonus.percentage}%
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 p-3 bg-bg-dark rounded-xl text-xs sm:text-sm text-text-muted">
                      <div className="flex gap-4">
                        {bonus.minDeposit && <span>Min: ₹{bonus.minDeposit}</span>}
                        {bonus.maxBonus && <span>Max: ₹{bonus.maxBonus}</span>}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {formatDate(bonus.expiresAt)}
                      </div>
                    </div>
                    <motion.button 
                      className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm cursor-pointer bg-gradient-to-r from-primary to-neon-purple text-white shadow-lg shadow-primary/40 transition-all duration-300 flex items-center justify-center gap-2"
                      onClick={() => handleClaimBonus(bonus.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Gift size={18} /> Claim Bonus
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'claimed' && (
          <motion.div
            key="claimed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {myClaims.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-bg-card border border-white/5 flex items-center justify-center">
                  <Check size={40} className="text-text-muted" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Claims Yet</h3>
                <p className="text-sm text-text-muted">Your claimed bonuses will appear here</p>
              </div>
            ) : (
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                {myClaims.map((claim) => (
                  <motion.div
                    key={claim.id}
                    variants={itemVariants}
                    className="bg-gradient-to-b from-bg-card-hover to-bg-card border border-white/5 rounded-2xl p-5 mb-4 opacity-80"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold font-mono text-lg mb-1">{claim.bonusCode}</h3>
                        <p className="text-xs text-text-muted">
                          Claimed on {new Date(claim.claimedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-4 py-2 rounded-xl bg-success/20 text-success text-sm font-bold">
                          +₹{claim.amount}
                        </span>
                        <Check size={24} className="text-success" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Bonus;
