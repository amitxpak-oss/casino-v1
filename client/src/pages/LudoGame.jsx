import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, 
  Trophy, X, RotateCcw, ArrowLeft, Sparkles,
  Crown, Zap, Target, Info, CheckCircle, AlertCircle,
  ChevronLeft, ChevronRight, Wallet, Bot, User as UserIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ludoService } from '../services/api';

const SAFE_ZONES = [0, 8, 13, 21, 26, 34, 39, 47];
const HOME_POSITION = 52;
const START_POSITION_USER = 1;
const START_POSITION_AI = 27;

const TRACK = [
  [6,1],[6,2],[6,3],[6,4],[6,5],
  [5,6],[4,6],[3,6],[2,6],[1,6],[0,6],[0,7],[0,8],
  [1,8],[2,8],[3,8],[4,8],[5,8],
  [6,9],[6,10],[6,11],[6,12],[6,13],
  [7,13],
  [8,13],[8,12],[8,11],[8,10],[8,9],
  [9,8],[10,8],[11,8],[12,8],[13,8],[14,8],
  [14,7],[14,6],
  [13,6],[12,6],[11,6],[10,6],[9,6],
  [8,5],[8,4],[8,3],[8,2],[8,1],
  [7,1]
];

const HOME_PATH_USER = [[7,2],[7,3],[7,4],[7,5],[7,6]];
const HOME_PATH_AI = [[7,12],[7,11],[7,10],[7,9],[7,8]];

const USER_HOME_POSITIONS = [[1,1],[1,4],[4,1],[4,4]];
const AI_HOME_POSITIONS = [[10,10],[10,13],[13,10],[13,13]];

const DiceIcon = ({ value, className = "w-8 h-8" }) => {
  const icons = { 1: Dice1, 2: Dice2, 3: Dice3, 4: Dice4, 5: Dice5, 6: Dice6 };
  const Icon = icons[value] || Dice1;
  return <Icon className={className} />;
};

const LudoGame = () => {
  const { user, fetchUser } = useAuth();
  const navigate = useNavigate();
  
  const [gameState, setGameState] = useState('setup');
  const [betAmount, setBetAmount] = useState(50);
  const [difficulty, setDifficulty] = useState('EASY');
  const [gameId, setGameId] = useState(null);
  const [board, setBoard] = useState(null);
  const [diceValue, setDiceValue] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [validMoves, setValidMoves] = useState([]);
  const [currentTurn, setCurrentTurn] = useState('USER');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [reward, setReward] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiThinking, setAiThinking] = useState(false);
  const [message, setMessage] = useState('');
  const [movingToken, setMovingToken] = useState(null);

  const betOptions = [10, 25, 50, 100, 200, 500];

  const startGame = async () => {
    if (user.balance < betAmount) {
      setError('Insufficient balance! Please add money to your wallet.');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await ludoService.startGame({ betAmount, difficulty });
      if (response.data.success) {
        setGameId(response.data.game.id);
        setBoard(response.data.game.board);
        setCurrentTurn('USER');
        setGameState('playing');
        setMessage('🎲 Roll the dice to start!');
        fetchUser();
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.details || 'Failed to start game');
    } finally {
      setLoading(false);
    }
  };

  const rollDice = useCallback(async () => {
    if (currentTurn !== 'USER' || isRolling || diceValue !== null) return;
    
    setIsRolling(true);
    setMessage('');
    
    try {
      const response = await ludoService.rollDice(gameId);
      if (response.data.success) {
        setDiceValue(response.data.diceValue);
        setValidMoves(response.data.validMoves || []);
        
        if (response.data.validMoves.length === 0) {
          if (response.data.diceValue === 6) {
            setMessage('🎉 You got a 6! Roll again!');
          } else {
            setMessage('No valid moves. AI\'s turn...');
            setTimeout(() => handleAITurn(), 1500);
          }
        } else if (response.data.validMoves.length === 1) {
          setMessage(`You rolled ${response.data.diceValue}! Select token ${response.data.validMoves[0] + 1} to move.`);
        } else {
          setMessage(`You rolled ${response.data.diceValue}! Select a token to move.`);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to roll dice');
    } finally {
      setIsRolling(false);
    }
  }, [currentTurn, isRolling, diceValue, gameId]);

  const moveToken = async (tokenIndex) => {
    if (!validMoves.includes(tokenIndex) || currentTurn !== 'USER') return;
    
    setLoading(true);
    setMessage('');
    setMovingToken(tokenIndex);
    
    try {
      const response = await ludoService.makeMove(gameId, tokenIndex);
      if (response.data.success) {
        setBoard(response.data.board);
        
        if (response.data.gameOver) {
          handleGameOver(response.data.winner, response.data.reward);
        } else {
          if (response.data.moveResult?.killed) {
            setMessage('🎯 You killed an AI token!');
            await new Promise(r => setTimeout(r, 800));
          }
          
          if (response.data.nextTurn === 'AI') {
            setCurrentTurn('AI');
            setDiceValue(null);
            setValidMoves([]);
            setMessage('AI is thinking...');
            setTimeout(() => handleAITurn(), 1000);
          } else {
            setCurrentTurn('USER');
            setDiceValue(null);
            setValidMoves([]);
            setMessage('🎲 Roll the dice again!');
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to move token');
    } finally {
      setLoading(false);
      setMovingToken(null);
    }
  };

  const handleAITurn = async () => {
    if (currentTurn !== 'AI') return;
    
    setAiThinking(true);
    setMessage('🤖 AI is rolling dice...');
    
    try {
      const rollResponse = await ludoService.rollDice(gameId);
      if (rollResponse.data.success) {
        setDiceValue(rollResponse.data.diceValue);
        await new Promise(r => setTimeout(r, 800));
        
        if (rollResponse.data.validMoves.length === 0) {
          setMessage(`AI rolled ${rollResponse.data.diceValue}. No moves. Your turn!`);
          await new Promise(r => setTimeout(r, 1000));
          
          const skipResponse = await ludoService.skipTurn(gameId);
          if (skipResponse.data.success) {
            setCurrentTurn('USER');
            setDiceValue(null);
            setMessage('🎲 Your turn! Roll the dice!');
          }
        } else {
          setMessage(`AI rolled ${rollResponse.data.diceValue}. AI is moving...`);
          await new Promise(r => setTimeout(r, 600));
          
          const validMoves = rollResponse.data.validMoves;
          const moveIndex = validMoves[Math.floor(Math.random() * validMoves.length)];
          
          const moveResponse = await ludoService.makeMove(gameId, moveIndex);
          if (moveResponse.data.success) {
            setBoard(moveResponse.data.board);
            
            if (moveResponse.data.gameOver) {
              handleGameOver(moveResponse.data.winner, moveResponse.data.reward);
            } else {
              if (moveResponse.data.moveResult?.killed) {
                setMessage('❌ AI killed your token!');
                await new Promise(r => setTimeout(r, 800));
              }
              
              setCurrentTurn('USER');
              setDiceValue(null);
              setMessage('🎲 Your turn! Roll the dice!');
            }
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'AI turn failed');
    } finally {
      setAiThinking(false);
    }
  };

  const handleGameOver = (winnerName, rewardAmount) => {
    setGameOver(true);
    setWinner(winnerName);
    setReward(rewardAmount || betAmount * 2);
    setGameState('result');
    
    if (winnerName === 'USER') {
      setShowConfetti(true);
      fetchUser();
    }
  };

  const handleForfeit = async () => {
    if (!window.confirm('Are you sure you want to forfeit? You will lose your bet.')) return;
    
    try {
      await ludoService.forfeit(gameId);
      handleGameOver('AI', 0);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to forfeit');
    }
  };

  const handlePlayAgain = () => {
    setGameState('setup');
    setGameId(null);
    setBoard(null);
    setDiceValue(null);
    setValidMoves([]);
    setGameOver(false);
    setWinner(null);
    setReward(0);
    setShowConfetti(false);
    setError('');
    setMessage('');
  };

  const getTokenPosition = (player, tokenIndex) => {
    if (!board) return null;
    const tokens = board[player];
    const token = tokens[tokenIndex];
    
    if (!token) return null;
    if (token.finished) return null;
    
    if (token.position === -1) {
      return player === 'USER' ? USER_HOME_POSITIONS[tokenIndex] : AI_HOME_POSITIONS[tokenIndex];
    }
    
    if (player === 'USER' && token.position >= 52) {
      const homeIndex = token.position - 52;
      return HOME_PATH_USER[homeIndex] || null;
    }
    
    if (player === 'AI' && token.position >= 52) {
      const homeIndex = token.position - 52;
      return HOME_PATH_AI[homeIndex] || null;
    }
    
    if (player === 'USER') {
      const trackIndex = (token.position + START_POSITION_USER - 1) % 52;
      return TRACK[trackIndex] || null;
    } else {
      const trackIndex = (token.position + START_POSITION_AI - 1) % 52;
      return TRACK[trackIndex] || null;
    }
  };

  const renderBoard = () => {
    const grid = [];
    for (let row = 0; row < 15; row++) {
      const rowCells = [];
      for (let col = 0; col < 15; col++) {
        let bgColor = 'bg-slate-800/50';
        let isSafe = false;
        let isCenter = false;
        
        if (row >= 1 && row <= 5 && col >= 1 && col <= 5) {
          bgColor = 'bg-red-600/40';
        } else if (row >= 1 && row <= 5 && col >= 9 && col <= 13) {
          bgColor = 'bg-green-600/40';
        } else if (row >= 9 && row <= 13 && col >= 1 && col <= 5) {
          bgColor = 'bg-yellow-600/40';
        } else if (row >= 9 && row <= 13 && col >= 9 && col <= 13) {
          bgColor = 'bg-blue-600/40';
        }
        
        if (row === 7 && (col === 2 || col === 5)) {
          bgColor = 'bg-red-500/60';
        }
        if (row === 7 && (col === 9 || col === 12)) {
          bgColor = 'bg-green-500/60';
        }
        if (row === 7 && col === 7) {
          bgColor = 'bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500';
          isCenter = true;
        }
        
        const safeIndices = [0, 8, 13, 21, 26, 34, 39, 47];
        const isOnTrack = TRACK.some((pos, idx) => pos[0] === row && pos[1] === col && safeIndices.includes(idx));
        if (isOnTrack && !isCenter) {
          isSafe = true;
        }
        
        rowCells.push(
          <div 
            key={`${row}-${col}`} 
            className={`w-6 h-6 sm:w-8 sm:h-8 border border-white/10 flex items-center justify-center ${bgColor} ${
              isSafe ? 'ring-1 ring-yellow-400/50' : ''
            }`}
          >
            {isCenter && (
              <Crown className="w-4 h-4 text-white drop-shadow-lg" />
            )}
          </div>
        );
      }
      grid.push(
        <div key={row} className="flex">
          {rowCells}
        </div>
      );
    }
    return grid;
  };

  const renderTokens = () => {
    if (!board) return null;
    
    const tokens = [];
    
    ['USER', 'AI'].forEach(player => {
      board[player].forEach((token, index) => {
        if (token.finished) return;
        
        const pos = getTokenPosition(player, index);
        if (!pos) return;
        
        const isValid = player === 'USER' && validMoves.includes(index);
        const isMoving = movingToken === index;
        
        tokens.push(
          <motion.div
            key={`${player}-${index}`}
            className={`absolute w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold shadow-lg z-20 cursor-pointer transition-all ${
              player === 'USER' 
                ? 'bg-gradient-to-br from-red-400 to-red-600 border-2 border-red-300' 
                : 'bg-gradient-to-br from-green-400 to-green-600 border-2 border-green-300'
            } ${
              isValid ? 'ring-4 ring-yellow-400 shadow-yellow-400/50 animate-pulse cursor-pointer' : ''
            } ${
              currentTurn !== 'USER' && player === 'USER' ? 'opacity-70' : ''
            } ${
              isMoving ? 'scale-125 z-30' : ''
            }`}
            style={{
              top: `${pos[0] * 6.67}%`,
              left: `${pos[1] * 6.67}%`,
              width: '6.67%',
              height: '6.67%',
              marginTop: '-3.33%',
              marginLeft: '-3.33%',
            }}
            whileHover={isValid ? { scale: 1.2 } : {}}
            onClick={() => player === 'USER' && isValid && moveToken(index)}
          >
            {index + 1}
          </motion.div>
        );
      });
    });
    
    return tokens;
  };

  const getTokensFinished = (player) => {
    if (!board) return { count: 0, total: 4 };
    const tokens = board[player];
    const finished = tokens.filter(t => t.finished).length;
    return { count: finished, total: 4 };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/30 to-slate-900 p-4">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(80)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181', '#aa96da', '#fcbad3'][Math.floor(Math.random() * 7)],
              }}
              initial={{ y: -20, x: 0, rotate: 0, opacity: 1 }}
              animate={{
                y: window.innerHeight + 50,
                x: (Math.random() - 0.5) * 300,
                rotate: Math.random() * 720,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 2.5 + Math.random() * 2,
                delay: Math.random() * 0.8,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/dashboard/games')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Target className="text-pink-500" />
            Ludo Master
          </h1>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <Wallet size={14} />
            <span className="text-emerald-400 font-bold">₹{(user?.balance || 0).toLocaleString()}</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {gameState === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="premium-card rounded-2xl p-5">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-xl shadow-pink-500/30">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Play Ludo & Win!</h2>
                  <p className="text-gray-400 text-sm">Beat the AI to double your coins</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Select Bet Amount</label>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {betOptions.map(amount => (
                        <button
                          key={amount}
                          onClick={() => setBetAmount(amount)}
                          className={`py-2.5 px-3 rounded-xl font-bold text-sm transition-all ${
                            betAmount === amount
                              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                              : 'bg-white/5 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          ₹{amount}
                        </button>
                      ))}
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="1000"
                      step="10"
                      value={betAmount}
                      onChange={e => setBetAmount(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-pink-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>₹10</span>
                      <span className="text-white font-bold">₹{betAmount}</span>
                      <span>₹1000</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">AI Difficulty</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setDifficulty('EASY')}
                        className={`py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
                          difficulty === 'EASY'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                            : 'bg-white/5 text-gray-400'
                        }`}
                      >
                        <Bot size={18} />
                        <span className="font-bold">Easy</span>
                      </button>
                      <button
                        onClick={() => setDifficulty('MEDIUM')}
                        className={`py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
                          difficulty === 'MEDIUM'
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                            : 'bg-white/5 text-gray-400'
                        }`}
                      >
                        <Bot size={18} />
                        <span className="font-bold">Medium</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-white/5 rounded-xl space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Your Bet</span>
                      <span className="text-white font-bold">₹{betAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Win Reward</span>
                      <span className="text-emerald-400 font-bold">₹{betAmount * 2}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Your Balance</span>
                      <span className={`font-bold ${user?.balance >= betAmount ? 'text-emerald-400' : 'text-red-400'}`}>
                        ₹{(user?.balance || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
                      {error}
                    </div>
                  )}

                  <motion.button
                    onClick={startGame}
                    disabled={loading || user?.balance < betAmount}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg shadow-lg disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? 'Starting...' : `Play Now - ₹${betAmount}`}
                  </motion.button>
                </div>
              </div>

              <div className="premium-card rounded-2xl p-4">
                <h3 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                  <Info size={16} />
                  How to Play
                </h3>
                <ul className="space-y-2 text-xs text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-400">1.</span>
                    Roll dice by clicking the dice button
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-400">2.</span>
                    Get 6 to bring a token onto the board
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-400">3.</span>
                    Click highlighted tokens to move them
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-400">4.</span>
                    Land on AI tokens to send them home
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-400">5.</span>
                    Get all 4 tokens home to win!
                  </li>
                </ul>
              </div>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    currentTurn === 'USER' ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                  }`} />
                  <span className={`text-sm font-medium ${
                    currentTurn === 'USER' ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {aiThinking ? 'AI thinking...' : currentTurn === 'USER' ? 'Your Turn' : "AI's Turn"}
                  </span>
                </div>
                <button
                  onClick={handleForfeit}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <X size={14} /> Forfeit
                </button>
              </div>

              <div className="premium-card rounded-2xl p-3 relative">
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden">
                  <div className="relative" style={{ aspectRatio: '1' }}>
                    <div className="absolute inset-0 grid grid-cols-15">
                      {renderBoard()}
                    </div>
                    <div className="absolute inset-0">
                      {renderTokens()}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3 px-1">
                  <div className="flex items-center gap-2">
                    <UserIcon size={14} className="text-red-400" />
                    <span className="text-xs text-gray-400">
                      {getTokensFinished('USER').count}/{getTokensFinished('USER').total}
                    </span>
                    <div className="flex gap-0.5">
                      {[0,1,2,3].map(i => (
                        <div 
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            board?.USER[i]?.finished ? 'bg-red-400' : 'bg-red-400/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <motion.div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                      currentTurn === 'USER' && diceValue === null && !isRolling
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-orange-500/40'
                        : 'bg-white/10'
                    }`}
                    whileHover={currentTurn === 'USER' && diceValue === null ? { scale: 1.1 } : {}}
                    whileTap={currentTurn === 'USER' && diceValue === null ? { scale: 0.9 } : {}}
                    onClick={rollDice}
                    animate={isRolling ? { rotate: 360 } : {}}
                    transition={isRolling ? { repeat: Infinity, duration: 0.2 } : {}}
                  >
                    {isRolling ? (
                      <Dice1 className="w-8 h-8 text-white" />
                    ) : diceValue ? (
                      <DiceIcon value={diceValue} className="w-8 h-8 text-white" />
                    ) : (
                      <Dice1 className="w-8 h-8 text-gray-500" />
                    )}
                  </motion.div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[0,1,2,3].map(i => (
                        <div 
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            board?.AI[i]?.finished ? 'bg-green-400' : 'bg-green-400/30'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      {getTokensFinished('AI').count}/{getTokensFinished('AI').total}
                    </span>
                    <Bot size={14} className="text-green-400" />
                  </div>
                </div>
              </div>

              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-xl text-center text-sm ${
                    message.includes('killed') ? 'bg-orange-500/20 text-orange-400' :
                    message.includes('6') ? 'bg-yellow-500/20 text-yellow-400' :
                    message.includes('No valid') || message.includes('thinking') ? 'bg-blue-500/20 text-blue-400' :
                    'bg-white/5 text-gray-300'
                  }`}
                >
                  {message}
                </motion.div>
              )}

              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              {currentTurn === 'USER' && diceValue !== null && validMoves.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-xl text-center"
                >
                  <p className="text-yellow-400 text-sm font-medium">
                    Select a highlighted token to move (tokens {validMoves.map(i => i + 1).join(', ')})
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {gameState === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="premium-card rounded-2xl p-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  winner === 'USER'
                    ? 'bg-gradient-to-br from-yellow-400 to-amber-500 shadow-2xl shadow-yellow-500/50'
                    : 'bg-gradient-to-br from-red-500 to-red-700'
                }`}
              >
                {winner === 'USER' ? (
                  <Trophy size={40} className="text-white" />
                ) : (
                  <X size={40} className="text-white" />
                )}
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-2">
                {winner === 'USER' ? '🎉 Victory!' : 'Game Over!'}
              </h2>
              
              <p className="text-gray-400 mb-4">
                {winner === 'USER'
                  ? `You defeated the AI!`
                  : 'Better luck next time!'}
              </p>

              {winner === 'USER' ? (
                <div className="p-4 bg-emerald-500/20 rounded-xl mb-4">
                  <p className="text-emerald-400 text-2xl font-bold">+₹{reward}</p>
                  <p className="text-gray-400 text-sm">You won {betAmount * 2} coins!</p>
                </div>
              ) : (
                <div className="p-4 bg-white/5 rounded-xl mb-4">
                  <p className="text-gray-400 text-sm">You lost ₹{betAmount}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handlePlayAgain}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RotateCcw size={18} />
                  Play Again
                </button>
                <button
                  onClick={() => navigate('/dashboard/games')}
                  className="flex-1 py-3 rounded-xl bg-white/10 text-white font-bold"
                >
                  Back to Games
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LudoGame;
