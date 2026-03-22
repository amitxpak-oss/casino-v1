import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const leaderboardController = {
  async getMonthly(req, res) {
    try {
      const leaders = await prisma.user.findMany({
        where: {
          role: 'USER'
        },
        take: 50,
        orderBy: { totalWinnings: 'desc' },
        select: {
          id: true,
          name: true,
          totalWinnings: true,
          gamesWon: true,
          gamesPlayed: true
        }
      });

      const ranked = leaders.map((user, index) => ({
        ...user,
        rank: index + 1,
        winRate: user.gamesPlayed > 0 
          ? Math.round((user.gamesWon / user.gamesPlayed) * 100) 
          : 0
      }));

      res.json({ leaders: ranked });
    } catch (error) {
      console.error('Get leaderboard error:', error);
      res.status(500).json({ error: 'Failed to fetch leaderboard.' });
    }
  },

  async getTopUsers(req, res) {
    try {
      const { limit = 10 } = req.query;
      
      const leaders = await prisma.user.findMany({
        where: {
          role: 'USER'
        },
        take: parseInt(limit),
        orderBy: { totalWinnings: 'desc' },
        select: {
          id: true,
          name: true,
          totalWinnings: true
        }
      });

      res.json({ leaders });
    } catch (error) {
      console.error('Get top users error:', error);
      res.status(500).json({ error: 'Failed to fetch top users.' });
    }
  },

  async getUserRank(req, res) {
    try {
      const userId = req.user?.id || req.params.userId;
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { totalWinnings: true, role: true }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      let rank;
      if (user.role !== 'USER') {
        rank = 0;
      } else {
        rank = await prisma.user.count({
          where: { 
            totalWinnings: { gt: user.totalWinnings },
            role: 'USER'
          }
        });
      }

      res.json({ 
        rank: rank + 1,
        winnings: user.totalWinnings
      });
    } catch (error) {
      console.error('Get user rank error:', error);
      res.status(500).json({ error: 'Failed to fetch user rank.' });
    }
  },

  async getMyRank(req, res) {
    try {
      const currentUser = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { totalWinnings: true, role: true }
      });

      if (!currentUser) {
        return res.status(404).json({ error: 'User not found.' });
      }

      let rank;
      let totalUsers;
      
      if (currentUser.role !== 'USER') {
        rank = 0;
        totalUsers = await prisma.user.count({ where: { role: 'USER' } });
      } else {
        rank = await prisma.user.count({
          where: { 
            totalWinnings: { gt: currentUser.totalWinnings },
            role: 'USER'
          }
        });
        totalUsers = await prisma.user.count({ where: { role: 'USER' } });
      }

      res.json({ 
        rank: rank + 1,
        totalUsers,
        winnings: currentUser.totalWinnings
      });
    } catch (error) {
      console.error('Get my rank error:', error);
      res.status(500).json({ error: 'Failed to fetch rank.' });
    }
  }
};
