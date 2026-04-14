// =============================================
// ORDER ROUTES - /api/orders
// =============================================
const express = require('express');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Helper: Get next token number (resets daily)
const getNextToken = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });
  return todayOrders + 1;
};

// POST /api/orders - Place a new order
router.post('/', protect, async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Validate items and calculate total
    let totalAmount = 0;
    const orderItems = [];
    let totalPrepTime = 0;

    for (const cartItem of items) {
      const menuItem = await MenuItem.findById(cartItem.menuItemId);
      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json({ message: `Item ${cartItem.name} is not available` });
      }
      const itemTotal = menuItem.price * cartItem.quantity;
      totalAmount += itemTotal;
      totalPrepTime = Math.max(totalPrepTime, menuItem.avgPrepTime);
      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: cartItem.quantity
      });
    }

    // Queue position = number of active orders
    const queuePosition = await Order.countDocuments({
      status: { $in: ['pending', 'preparing'] }
    });

    // Estimated time = queue position * avg prep time
    const estimatedTime = (queuePosition + 1) * totalPrepTime;

    // Generate unique token
    const tokenNumber = await getNextToken();

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      tokenNumber,
      queuePosition: queuePosition + 1,
      estimatedTime,
      status: 'pending'
    });

    // Update menu item order counts
    for (const cartItem of items) {
      await MenuItem.findByIdAndUpdate(cartItem.menuItemId, {
        $inc: { orderCount: cartItem.quantity, todayOrderCount: cartItem.quantity }
      });
    }

    const populatedOrder = await Order.findById(order._id).populate('user', 'name email');

    res.status(201).json({
      message: 'Order placed successfully!',
      order: populatedOrder,
      tokenNumber,
      queuePosition: queuePosition + 1,
      estimatedTime
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders - Get user's order history
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.menuItem', 'name image category');

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders/:id - Get specific order status (for polling)
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/orders/:id/reorder - Reorder from history
router.post('/:id/reorder', protect, async (req, res) => {
  try {
    const originalOrder = await Order.findById(req.params.id);
    if (!originalOrder) return res.status(404).json({ message: 'Order not found' });

    // Return the items to re-add to cart
    res.json({
      message: 'Items ready to add to cart',
      items: originalOrder.items
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
