// =============================================
// MENU ROUTES - /api/menu
// =============================================
const express = require('express');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

const router = express.Router();

// GET /api/menu - Get all menu items grouped by category
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find({ isAvailable: true }).sort({ category: 1, name: 1 });

    // Group by category
    const grouped = {};
    items.forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });

    res.json({ menu: grouped, total: items.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/menu/search?q=keyword - Smart search with suggestions
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.json({ results: [] });
    }

    const results = await MenuItem.find({
      isAvailable: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    }).limit(10);

    res.json({ results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/menu/popular - Trending items (most ordered today)
router.get('/popular', async (req, res) => {
  try {
    const popularItems = await MenuItem.find({ isAvailable: true })
      .sort({ todayOrderCount: -1, orderCount: -1 })
      .limit(8);

    res.json({ popular: popularItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/menu/peak-status - Peak time detection
router.get('/peak-status', async (req, res) => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentOrderCount = await Order.countDocuments({
      createdAt: { $gte: oneHourAgo },
      status: { $ne: 'cancelled' }
    });

    // More than 10 orders in last hour = high rush
    const isPeak = recentOrderCount > 10;
    const queueLength = await Order.countDocuments({
      status: { $in: ['pending', 'preparing'] }
    });

    res.json({
      isPeak,
      status: isPeak ? 'High Rush 🔥' : 'Low Traffic ✅',
      recentOrders: recentOrderCount,
      queueLength
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
