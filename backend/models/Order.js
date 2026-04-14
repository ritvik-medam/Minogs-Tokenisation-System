// =============================================
// ORDER MODEL
// =============================================
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  name: String,
  price: Number,
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  
  // Unique token number for canteen pickup
  tokenNumber: {
    type: Number,
    required: true
  },
  
  totalAmount: {
    type: Number,
    required: true
  },
  
  // Order lifecycle: pending → preparing → ready
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // Queue position when order was placed
  queuePosition: {
    type: Number,
    default: 0
  },
  
  // Estimated prep time in minutes
  estimatedTime: {
    type: Number,
    default: 10
  },
  
  // When status changed to 'ready'
  readyAt: Date,
  
  // Notification sent flag
  notificationSent: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
