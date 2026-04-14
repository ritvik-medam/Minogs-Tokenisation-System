// =============================================
// ADMIN ROUTES - /api/admin
// =============================================
const express = require('express');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// GET /api/admin/stats - Dashboard analytics
router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalOrdersToday, totalRevenue, activeOrders, allOrders] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: today }, status: { $ne: 'cancelled' } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: today }, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.countDocuments({ status: { $in: ['pending', 'preparing'] } }),
      Order.find({ createdAt: { $gte: today } }).select('estimatedTime status createdAt readyAt')
    ]);

    // Most popular item today
    const popularItem = await MenuItem.findOne()
      .sort({ todayOrderCount: -1 })
      .select('name todayOrderCount image');

    // Average prep time (from completed orders today)
    const completedOrders = allOrders.filter(o => o.status === 'ready' || o.status === 'completed');
    let avgPrepTime = 0;
    if (completedOrders.length > 0) {
      const totalTime = completedOrders.reduce((sum, o) => {
        if (o.readyAt) return sum + (o.readyAt - o.createdAt) / 60000;
        return sum + o.estimatedTime;
      }, 0);
      avgPrepTime = Math.round(totalTime / completedOrders.length);
    }

    res.json({
      totalOrdersToday,
      totalRevenue: totalRevenue[0]?.total || 0,
      activeOrders,
      popularItem,
      avgPrepTime,
      completedToday: completedOrders.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/orders - All orders
router.get('/orders', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/admin/orders/:id/status - Update order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const update = { status };
    if (status === 'ready') update.readyAt = new Date();

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('user', 'name email');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/menu - All menu items (including unavailable)
router.get('/menu', async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ category: 1, name: 1 });
    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/admin/menu - Add new menu item
router.post('/menu', async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json({ message: 'Menu item added', item });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/admin/menu/:id - Update menu item
router.put('/menu/:id', async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item updated', item });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/admin/menu/:id - Delete menu item
router.delete('/menu/:id', async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
