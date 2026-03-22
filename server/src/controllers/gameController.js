import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const gameController = {
  async getAll(req, res) {
    try {
      const { category, featured, hot } = req.query;
      const where = { isActive: true };
      
      if (category) where.category = category;
      if (featured === 'true') where.isFeatured = true;
      if (hot === 'true') where.isHot = true;

      const games = await prisma.game.findMany({
        where,
        orderBy: [
          { isFeatured: 'desc' },
          { players: 'desc' },
          { name: 'asc' }
        ]
      });

      res.json({ games });
    } catch (error) {
      console.error('Get games error:', error);
      res.status(500).json({ error: 'Failed to fetch games.' });
    }
  },

  async getById(req, res) {
    try {
      const game = await prisma.game.findUnique({
        where: { id: req.params.id }
      });

      if (!game) {
        return res.status(404).json({ error: 'Game not found.' });
      }

      res.json({ game });
    } catch (error) {
      console.error('Get game error:', error);
      res.status(500).json({ error: 'Failed to fetch game.' });
    }
  },

  async getCategories(req, res) {
    try {
      const categories = await prisma.game.groupBy({
        by: ['category'],
        where: { isActive: true },
        _count: true
      });

      res.json({ 
        categories: categories.map(c => ({
          name: c.category,
          count: c._count
        }))
      });
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({ error: 'Failed to fetch categories.' });
    }
  },

  async getFeatured(req, res) {
    try {
      const games = await prisma.game.findMany({
        where: { isFeatured: true, isActive: true },
        take: 5
      });
      res.json({ games });
    } catch (error) {
      console.error('Get featured error:', error);
      res.status(500).json({ error: 'Failed to fetch featured games.' });
    }
  },

  async create(req, res) {
    try {
      const { name, description, category, minBet, maxBet, maxWin, color, image, icon, isHot, isFeatured } = req.body;

      const game = await prisma.game.create({
        data: {
          name,
          description,
          category,
          minBet: minBet || 1,
          maxBet: maxBet || 10000,
          maxWin: maxWin || 100000,
          color: color || '#f97316',
          image,
          icon: icon || 'Star',
          isHot: isHot || false,
          isFeatured: isFeatured || false
        }
      });

      res.status(201).json({ message: 'Game created.', game });
    } catch (error) {
      console.error('Create game error:', error);
      res.status(500).json({ error: 'Failed to create game.' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const game = await prisma.game.update({
        where: { id },
        data: updates
      });

      res.json({ message: 'Game updated.', game });
    } catch (error) {
      console.error('Update game error:', error);
      res.status(500).json({ error: 'Failed to update game.' });
    }
  }
};
