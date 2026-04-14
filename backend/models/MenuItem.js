// =============================================
// MENU ITEM MODEL
// =============================================
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'South Indian', 'North Indian', 'Chinese', 'Quick Bites',
      'Non-Veg', 'Beverages', 'Thali', 'Chaats', 'Egg Items', 'Ice Cream'
    ]
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  // Emoji used as food image (no external image needed)
  image: {
    type: String,
    default: '🍽️'
  },
  description: {
    type: String,
    default: ''
  },
  isVeg: {
    type: Boolean,
    default: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  // Track how many times ordered (for trending)
  orderCount: {
    type: Number,
    default: 0
  },
  // Orders placed today (reset daily)
  todayOrderCount: {
    type: Number,
    default: 0
  },
  avgPrepTime: {
    type: Number,
    default: 5  // minutes
  }
}, { timestamps: true });

// Text index for search functionality
menuItemSchema.index({ name: 'text', category: 'text', description: 'text' });

module.exports = mongoose.model('MenuItem', menuItemSchema);
