import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultBonuses = [
  { code: 'WELCOME100', type: 'WELCOME', title: 'Welcome Bonus', description: 'Get 100% bonus on first deposit', percentage: 100, reward: 5000, maxBonus: 5000, minDeposit: 100 },
  { code: 'DAILY500', type: 'DAILY', title: 'Daily Bonus', description: 'Claim your free daily bonus', percentage: 0, reward: 500, minDeposit: null },
  { code: 'CASHBACK10', type: 'CASHBACK', title: 'Weekly Cashback', description: 'Get 10% cashback on losses', percentage: 10, reward: 2000, maxBonus: 2000, minDeposit: 1000 },
  { code: 'REFER200', type: 'REFER', title: 'Refer & Earn', description: '₹200 for each friend who deposits', percentage: 0, reward: 200, minDeposit: null },
  { code: 'DEPOSIT50', type: 'DEPOSIT', title: 'Deposit Bonus', description: 'Get 50% extra on deposits above ₹1,000', percentage: 50, reward: 5000, maxBonus: 5000, minDeposit: 1000 },
  { code: 'HAPPY2X', type: 'PROMO', title: 'Happy Hours', description: '2x bonus between 6-9 PM', percentage: 100, reward: 2000, maxBonus: 2000, minDeposit: 500 },
];

async function seedBonuses() {
  for (const bonus of defaultBonuses) {
    await prisma.bonus.upsert({
      where: { code: bonus.code },
      update: {},
      create: {
        ...bonus,
        isActive: true
      }
    });
  }
}

seedBonuses().catch(console.error);

export const bonusController = {
  async getAll(req, res) {
    try {
      const bonuses = await prisma.bonus.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      });

      let userClaims = [];
      if (req.user) {
        userClaims = await prisma.bonusClaim.findMany({
          where: { userId: req.user.id }
        });
      }

      const bonusesWithStatus = bonuses.map(bonus => {
        const claim = userClaims.find(c => c.bonusId === bonus.id);
        return {
          ...bonus,
          claimed: !!claim,
          claimStatus: claim?.status || null
        };
      });

      res.json({ bonuses: bonusesWithStatus });
    } catch (error) {
      console.error('Get bonuses error:', error);
      res.status(500).json({ error: 'Failed to fetch bonuses.' });
    }
  },

  async getMyBonuses(req, res) {
    try {
      const claims = await prisma.bonusClaim.findMany({
        where: { userId: req.user.id },
        include: { bonus: true },
        orderBy: { createdAt: 'desc' }
      });

      res.json({ claims });
    } catch (error) {
      console.error('Get my bonuses error:', error);
      res.status(500).json({ error: 'Failed to fetch bonuses.' });
    }
  },

  async validateCode(req, res) {
    try {
      const { code } = req.body;

      const bonus = await prisma.bonus.findUnique({
        where: { code: code.toUpperCase() }
      });

      if (!bonus) {
        return res.status(404).json({ error: 'Invalid bonus code.' });
      }

      if (!bonus.isActive) {
        return res.status(400).json({ error: 'This bonus is no longer active.' });
      }

      if (bonus.expiresAt && bonus.expiresAt < new Date()) {
        return res.status(400).json({ error: 'This bonus has expired.' });
      }

      if (bonus.maxClaims && bonus.claims >= bonus.maxClaims) {
        return res.status(400).json({ error: 'This bonus has reached its limit.' });
      }

      const existingClaim = await prisma.bonusClaim.findUnique({
        where: {
          userId_bonusId: {
            userId: req.user.id,
            bonusId: bonus.id
          }
        }
      });

      if (existingClaim) {
        return res.status(400).json({ error: 'You have already used this bonus.' });
      }

      res.json({ bonus, valid: true });
    } catch (error) {
      console.error('Validate code error:', error);
      res.status(500).json({ error: 'Failed to validate bonus.' });
    }
  },

  async claimBonus(req, res) {
    try {
      const { code } = req.body;

      const bonus = await prisma.bonus.findUnique({
        where: { code: code.toUpperCase() }
      });

      if (!bonus) {
        return res.status(404).json({ error: 'Invalid bonus code.' });
      }

      if (!bonus.isActive) {
        return res.status(400).json({ error: 'This bonus is no longer active.' });
      }

      const existingClaim = await prisma.bonusClaim.findUnique({
        where: {
          userId_bonusId: {
            userId: req.user.id,
            bonusId: bonus.id
          }
        }
      });

      if (existingClaim) {
        return res.status(400).json({ error: 'You have already used this bonus.' });
      }

      await prisma.bonusClaim.create({
        data: {
          userId: req.user.id,
          bonusId: bonus.id,
          amount: bonus.reward,
          status: 'ACTIVE'
        }
      });

      await prisma.bonus.update({
        where: { id: bonus.id },
        data: { claims: { increment: 1 } }
      });

      await prisma.user.update({
        where: { id: req.user.id },
        data: { bonusBalance: { increment: bonus.reward } }
      });

      res.json({ 
        message: 'Bonus claimed successfully!',
        amount: bonus.reward 
      });
    } catch (error) {
      console.error('Claim bonus error:', error);
      res.status(500).json({ error: 'Failed to claim bonus.' });
    }
  },

  async getReferralStats(req, res) {
    try {
      const referrals = await prisma.user.findMany({
        where: { referredBy: req.user.id },
        select: {
          id: true,
          name: true,
          createdAt: true,
          bonusClaims: {
            where: { status: 'USED' }
          }
        }
      });

      const totalEarned = referrals.filter(r => r.bonusClaims.length > 0).length * 200;
      const pendingBonus = referrals.length * 200 - totalEarned;

      res.json({
        referralCode: req.user.referralCode,
        totalReferrals: referrals.length,
        referrals,
        totalEarned,
        pendingBonus
      });
    } catch (error) {
      console.error('Get referral stats error:', error);
      res.status(500).json({ error: 'Failed to fetch referral stats.' });
    }
  },

  async create(req, res) {
    try {
      const { code, type, title, description, percentage, reward, minDeposit, maxBonus, maxClaims, expiresAt } = req.body;

      const existing = await prisma.bonus.findUnique({ where: { code } });
      if (existing) {
        return res.status(400).json({ error: 'Bonus code already exists.' });
      }

      const bonus = await prisma.bonus.create({
        data: {
          code: code.toUpperCase(),
          type,
          title,
          description,
          percentage: percentage || 0,
          reward,
          minDeposit,
          maxBonus,
          maxClaims,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          isActive: true
        }
      });

      res.status(201).json({ message: 'Bonus created.', bonus });
    } catch (error) {
      console.error('Create bonus error:', error);
      res.status(500).json({ error: 'Failed to create bonus.' });
    }
  }
};
