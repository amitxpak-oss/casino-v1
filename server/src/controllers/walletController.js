import { PrismaClient } from '@prisma/client';
import { userService } from '../services/userService.js';
import { transactionService } from '../services/transactionService.js';

const prisma = new PrismaClient();

export const walletController = {
  async getBalance(req, res) {
    try {
      const user = await userService.findById(req.user.id);
      res.json({
        balance: user.balance,
        bonusBalance: user.bonusBalance
      });
    } catch (error) {
      console.error('Get balance error:', error);
      res.status(500).json({ error: 'Failed to fetch balance.' });
    }
  },

  async addBalance(req, res) {
    try {
      const { userId, amount, type = 'balance', remark } = req.body;

      if (!userId || !amount || amount <= 0) {
        return res.status(400).json({ error: 'Valid userId and amount are required.' });
      }

      const user = await userService.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      const updatedUser = await userService.updateBalance(userId, amount, type);
      await transactionService.create(userId, type === 'bonus' ? 'BONUS' : 'DEPOSIT', amount, remark);

      res.json({
        message: 'Balance added successfully.',
        balance: updatedUser.balance,
        bonusBalance: updatedUser.bonusBalance
      });
    } catch (error) {
      console.error('Add balance error:', error);
      res.status(500).json({ error: 'Failed to add balance.' });
    }
  },

  async deposit(req, res) {
    try {
      const { amount, bonusCode, remark } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Valid amount is required.' });
      }

      let bonusAmount = 0;
      let bonusApplied = false;

      if (bonusCode) {
        const bonus = await prisma.bonus.findUnique({
          where: { code: bonusCode.toUpperCase() }
        });

        if (bonus && bonus.isActive) {
          if (bonus.minDeposit && amount >= bonus.minDeposit) {
            bonusAmount = bonus.reward;
            if (bonus.percentage > 0 && bonus.maxBonus) {
              bonusAmount = Math.min(amount * (bonus.percentage / 100), bonus.maxBonus);
            }
            bonusApplied = true;

            await prisma.bonusClaim.upsert({
              where: {
                userId_bonusId: {
                  userId: req.user.id,
                  bonusId: bonus.id
                }
              },
              update: {},
              create: {
                userId: req.user.id,
                bonusId: bonus.id,
                amount: bonusAmount,
                deposited: amount,
                status: 'USED'
              }
            });

            await prisma.bonus.update({
              where: { id: bonus.id },
              data: { claims: { increment: 1 } }
            });
          }
        }
      }

      const updatedUser = await userService.updateBalance(req.user.id, amount, 'balance');
      
      if (bonusAmount > 0) {
        await userService.updateBalance(req.user.id, bonusAmount, 'bonus');
        await transactionService.create(req.user.id, 'BONUS', bonusAmount, `Welcome bonus from ${bonusCode}`);
      }

      await transactionService.create(req.user.id, 'DEPOSIT', amount, remark);

      res.json({
        message: 'Deposit successful.',
        balance: updatedUser.balance + (bonusAmount > 0 ? updatedUser.bonusBalance + bonusAmount : updatedUser.bonusBalance),
        bonusBalance: updatedUser.bonusBalance + bonusAmount,
        bonusApplied,
        bonusAmount
      });
    } catch (error) {
      console.error('Deposit error:', error);
      res.status(500).json({ error: 'Deposit failed.' });
    }
  },

  async getTransactions(req, res) {
    try {
      const { page = 1, limit = 20, type } = req.query;
      const result = await transactionService.getByUser(
        req.user.id, 
        parseInt(page), 
        parseInt(limit),
        type
      );
      res.json(result);
    } catch (error) {
      console.error('Get transactions error:', error);
      res.status(500).json({ error: 'Failed to fetch transactions.' });
    }
  },

  async transferToMain(req, res) {
    try {
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Valid amount is required.' });
      }

      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      if (user.bonusBalance < amount) {
        return res.status(400).json({ error: 'Insufficient bonus balance.' });
      }

      await prisma.user.update({
        where: { id: req.user.id },
        data: {
          bonusBalance: { decrement: amount },
          balance: { increment: amount }
        }
      });

      await transactionService.create(req.user.id, 'DEPOSIT', amount, 'Bonus to main wallet');

      res.json({ message: 'Transfer successful.' });
    } catch (error) {
      console.error('Transfer error:', error);
      res.status(500).json({ error: 'Transfer failed.' });
    }
  }
};
