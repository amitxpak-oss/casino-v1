import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Coins, Trophy, Target, Flame, Play, RotateCcw, ChevronUp, ChevronDown, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { gameService } from '../services/api';
import toast from 'react-hot-toast';

const COLORS = ['red', 'green', 'blue'];
const MATKA_NUMBERS = ['Single', 'Jodi', 'Patti', 'Line'];
const SPIN_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const GamePlay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUser, fetchUser } = useAuth();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [betAmount, setBetAmount] = useState(50);
  const [selectedOption, setSelectedOption] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState([]);
  const [balance, setBalance] = useState(user?.balance || 0);

  useEffect(() => {
    fetchGame();
    setBalance(user?.balance || 0);
  }, [id]);

  const fetchGame = async () => {
    try {
      const response = await gameService.getOne(id);
      setGame(response.data.game);
    } catch (error) {
      console.error('Failed to fetch game:', error);
      toast.error('Failed to load game');
      navigate('/dashboard/games');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount || 0);

  const placeBet = async () => {
    if (!selectedOption) {
      toast.error('Please select an option');
      return;
    }
    if (betAmount < game?.minBet) {
      toast.error(`Minimum bet is ${formatCurrency(game?.minBet)}`);
      return;
    }
    if (betAmount > game?.maxBet) {
      toast.error(`Maximum bet is ${formatCurrency(game?.maxBet)}`);
      return;
    }
    if (betAmount > balance) {
      toast.error('Insufficient balance');
      return;
    }

    setIsPlaying(true);
    setGameResult(null);

    setTimeout(() => {
      playGame();
    }, 1500);
  };

  const playGame = () => {
    let result;
    let winAmount = 0;
    let isWin = false;

    switch (game?.name) {
      case 'Colour':
        const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        result = { type: 'color', value: randomColor };
        isWin = selectedOption === randomColor;
        winAmount = isWin ? betAmount * 3 : 0;
        break;

      case 'Matka':
        const randomNum = Math.floor(Math.random() * 10) + 1;
        result = { type: 'number', value: randomNum };
        if (selectedOption === 'single') {
          isWin = randomNum % 2 === 1;
        } else if (selectedOption === 'double') {
          isWin = randomNum % 2 === 0;
        } else {
          isWin = selectedOption === randomNum.toString();
        }
        winAmount = isWin ? betAmount * 9 : 0;
        break;

      case 'Ludo':
        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        const total = dice1 + dice2;
        result = { type: 'dice', value: [dice1, dice2], total };
        if (selectedOption === 'odd') {
          isWin = total % 2 === 1;
        } else if (selectedOption === 'even') {
          isWin = total % 2 === 0;
        } else {
          isWin = selectedOption === total;
        }
        winAmount = isWin ? betAmount * 5 : 0;
        break;

      case 'Aviator':
        const multiplier = Math.random() * 10 + 1;
        const cashoutAt = Math.floor(multiplier * 10) / 10;
        result = { type: 'aviator', value: cashoutAt };
        const shouldWin = Math.random() > 0.4;
        if (shouldWin) {
          isWin = true;
          winAmount = betAmount * cashoutAt;
        }
        break;

      default:
        const randomVal = Math.floor(Math.random() * 10) + 1;
        result = { type: 'number', value: randomVal };
        isWin = Math.random() > 0.5;
        winAmount = isWin ? betAmount * 2 : 0;
    }

    const newBalance = isWin ? balance - betAmount + winAmount : balance - betAmount;
    setBalance(newBalance);
    setGameResult({ ...result, isWin, winAmount, betAmount });
    
    setHistory(prev => [{
      ...result,
      isWin,
      betAmount,
      timestamp: new Date()
    }, ...prev.slice(0, 9)]);

    if (isWin) {
      updateUser({ balance: newBalance });
      toast.success(`You won ${formatCurrency(winAmount)}!`);
    }

    setIsPlaying(false);
    setSelectedOption(null);
  };

  const resetGame = () => {
    setGameResult(null);
    setSelectedOption(null);
  };

  const quickAmounts = [10, 25, 50, 100, 250, 500, 1000];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-14 h-14 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[600px] mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <motion.button
          className="p-3 rounded-xl bg-white/5 text-text-secondary border border-white/10 transition-all duration-300 hover:bg-white/10 hover:text-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard/games')}
        >
          <ArrowLeft size={20} />
        </motion.button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black">{game?.name}</h1>
          <p className="text-sm text-text-muted">{game?.description}</p>
        </div>
      </div>

      <motion.div 
        className="relative overflow-hidden rounded-3xl p-6 mb-6"
        style={{ background: `linear-gradient(135deg, ${game?.color}20, ${game?.color}05)`, border: `1px solid ${game?.color}30` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full" style={{ backgroundColor: `${game?.color}20`, filter: 'blur(40px)' }} />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-text-muted">Your Balance</span>
            <span className="text-2xl font-black">{formatCurrency(balance)}</span>
          </div>
          <div className="flex gap-4 text-sm">
            <div>
              <span className="text-text-muted">Min: </span>
              <span className="font-bold">{formatCurrency(game?.minBet)}</span>
            </div>
            <div>
              <span className="text-text-muted">Max: </span>
              <span className="font-bold">{formatCurrency(game?.maxBet)}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {gameResult ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="premium-card rounded-3xl p-8 text-center mb-6"
          >
            <motion.div
              className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
                gameResult.isWin ? 'bg-success/20 animate-pulse' : 'bg-danger/20'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            >
              {gameResult.isWin ? (
                <Trophy size={48} className="text-success" />
              ) : (
                <X size={48} className="text-danger" />
              )}
            </motion.div>

            <h2 className={`text-3xl font-black mb-2 ${gameResult.isWin ? 'text-success' : 'text-danger'}`}>
              {gameResult.isWin ? 'You Won!' : 'You Lost!'}
            </h2>

            {gameResult.isWin && (
              <motion.div 
                className="text-5xl font-black text-success mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                +{formatCurrency(gameResult.winAmount)}
              </motion.div>
            )}

            <div className="p-4 bg-black/20 rounded-xl mb-6">
              <div className="text-sm text-text-muted mb-2">Result</div>
              <div className="text-2xl font-bold">
                {gameResult.type === 'color' && (
                  <span className={`px-4 py-2 rounded-xl ${
                    gameResult.value === 'red' ? 'bg-red-500 text-white' :
                    gameResult.value === 'green' ? 'bg-green-500 text-white' :
                    'bg-blue-500 text-white'
                  }`}>
                    {gameResult.value.toUpperCase()}
                  </span>
                )}
                {gameResult.type === 'number' && (
                  <span className="text-5xl">{gameResult.value}</span>
                )}
                {gameResult.type === 'dice' && (
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-5xl">{gameResult.value[0]}</span>
                    <span className="text-3xl text-text-muted">+</span>
                    <span className="text-5xl">{gameResult.value[1]}</span>
                    <span className="text-3xl text-text-muted">=</span>
                    <span className="text-5xl text-warning">{gameResult.total}</span>
                  </div>
                )}
                {gameResult.type === 'aviator' && (
                  <span className="text-warning">{gameResult.value.toFixed(1)}x</span>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                className="flex-1 py-4 rounded-2xl font-bold text-sm cursor-pointer bg-gradient-to-r from-primary to-neon-purple text-white shadow-lg shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetGame}
              >
                <Play size={18} /> Play Again
              </motion.button>
              <motion.button
                className="px-6 py-4 rounded-2xl font-bold text-sm cursor-pointer bg-white/5 text-text-secondary border border-white/10 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/dashboard/games')}
              >
                Back
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="betting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="premium-card rounded-3xl p-6 mb-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Target size={20} className="text-primary" />
                Select Your Bet
              </h3>

              {game?.name === 'Colour' && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {COLORS.map((color) => (
                    <motion.button
                      key={color}
                      className={`py-8 rounded-2xl font-bold text-lg capitalize transition-all duration-300 ${
                        selectedOption === color
                          ? `${color === 'red' ? 'bg-red-500' : color === 'green' ? 'bg-green-500' : 'bg-blue-500'} text-white shadow-lg scale-105`
                          : `${color === 'red' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : color === 'green' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedOption(color)}
                    >
                      {color}
                    </motion.button>
                  ))}
                </div>
              )}

              {game?.name === 'Matka' && (
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {['single', 'double', ...SPIN_VALUES.map(String)].map((opt) => (
                    <motion.button
                      key={opt}
                      className={`py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                        selectedOption === opt
                          ? 'bg-gradient-to-r from-primary to-neon-purple text-white shadow-lg shadow-primary/30 scale-105'
                          : 'bg-white/5 text-text-secondary border border-white/10 hover:bg-white/10'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedOption(opt)}
                    >
                      {opt === 'single' ? 'Odd' : opt === 'double' ? 'Even' : opt}
                    </motion.button>
                  ))}
                </div>
              )}

              {game?.name === 'Ludo' && (
                <div className="mb-6">
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {Array.from({ length: 10 }, (_, i) => i + 2).map((num) => (
                      <motion.button
                        key={num}
                        className={`py-3 rounded-xl font-bold transition-all duration-300 ${
                          selectedOption === num
                            ? 'bg-gradient-to-r from-warning to-amber-600 text-black shadow-lg shadow-warning/30 scale-105'
                            : 'bg-white/5 text-text-secondary border border-white/10 hover:bg-white/10'
                        }`}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedOption(num)}
                      >
                        {num}
                      </motion.button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      className={`py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                        selectedOption === 'odd'
                          ? 'bg-gradient-to-r from-primary to-neon-purple text-white shadow-lg'
                          : 'bg-white/5 text-text-secondary border border-white/10'
                      }`}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedOption('odd')}
                    >
                      Odd
                    </motion.button>
                    <motion.button
                      className={`py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                        selectedOption === 'even'
                          ? 'bg-gradient-to-r from-success to-emerald-600 text-white shadow-lg'
                          : 'bg-white/5 text-text-secondary border border-white/10'
                      }`}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedOption('even')}
                    >
                      Even
                    </motion.button>
                  </div>
                </div>
              )}

              {game?.name === 'Aviator' && (
                <div className="mb-6 p-6 bg-black/20 rounded-2xl text-center">
                  <div className="text-sm text-text-muted mb-2">Aviator flies away with your bet!</div>
                  <div className="text-5xl font-black text-warning mb-2">🚀</div>
                  <div className="text-sm text-text-muted">Select bet amount and try your luck</div>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-bold text-text-secondary mb-3">Bet Amount</label>
                <input
                  type="number"
                  className="w-full py-4 px-4 bg-black/30 border-2 border-white/10 rounded-2xl text-white text-2xl font-bold text-center focus:outline-none focus:border-primary transition-all"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Math.max(game?.minBet || 10, Math.min(game?.maxBet || 10000, parseInt(e.target.value) || 0)))}
                />
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {quickAmounts.map((amt) => (
                    <motion.button
                      key={amt}
                      className={`py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                        betAmount === amt
                          ? 'bg-primary text-white'
                          : 'bg-white/5 text-text-muted hover:bg-white/10'
                      }`}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setBetAmount(amt)}
                    >
                      {formatCurrency(amt)}
                    </motion.button>
                  ))}
                </div>
              </div>

              <motion.button
                className={`w-full py-5 rounded-2xl font-bold text-lg cursor-pointer shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                  isPlaying || !selectedOption
                    ? 'bg-gray-500/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-success to-emerald-600 text-white shadow-success/30 hover:shadow-success/50'
                }`}
                disabled={isPlaying || !selectedOption}
                whileHover={!isPlaying && selectedOption ? { scale: 1.02 } : {}}
                whileTap={!isPlaying && selectedOption ? { scale: 0.98 } : {}}
                onClick={placeBet}
              >
                {isPlaying ? (
                  <>
                    <RotateCcw size={24} className="animate-spin" /> Placing Bet...
                  </>
                ) : (
                  <>
                    <Play size={24} /> Bet {formatCurrency(betAmount)}
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {history.length > 0 && (
        <div className="premium-card rounded-2xl p-4">
          <h3 className="font-bold mb-4 text-sm text-text-muted">Recent Results</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {history.map((h, i) => (
              <div
                key={i}
                className={`px-4 py-2 rounded-xl text-sm font-bold shrink-0 ${
                  h.isWin ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
                }`}
              >
                {h.type === 'color' && h.value?.charAt(0).toUpperCase()}
                {h.type === 'number' && h.value}
                {h.type === 'dice' && h.total}
                {h.type === 'aviator' && `${h.value}x`}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePlay;
