// =============================================
// SEED DATA - Populate menu on first run
// =============================================
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');

const menuItems = [
  // South Indian
  { name: 'Masala Dosa', category: 'South Indian', price: 60, image: '🫓', description: 'Crispy dosa with spiced potato filling', isVeg: true, avgPrepTime: 8 },
  { name: 'Idli Sambar', category: 'South Indian', price: 40, image: '🍚', description: '3 soft idlis with sambar and chutney', isVeg: true, avgPrepTime: 5 },
  { name: 'Vada', category: 'South Indian', price: 30, image: '🍩', description: 'Crispy medu vada with chutney', isVeg: true, avgPrepTime: 5 },
  { name: 'Rava Dosa', category: 'South Indian', price: 70, image: '🫓', description: 'Thin crispy rava dosa', isVeg: true, avgPrepTime: 8 },
  { name: 'Uttapam', category: 'South Indian', price: 55, image: '🥞', description: 'Thick pancake with vegetables', isVeg: true, avgPrepTime: 8 },

  // North Indian
  { name: 'Chole Bhature', category: 'North Indian', price: 80, image: '🫘', description: 'Fluffy bhature with spicy chole', isVeg: true, avgPrepTime: 10 },
  { name: 'Paneer Butter Masala', category: 'North Indian', price: 120, image: '🧀', description: 'Rich creamy paneer curry', isVeg: true, avgPrepTime: 12 },
  { name: 'Dal Makhani', category: 'North Indian', price: 90, image: '🫘', description: 'Slow cooked black lentils', isVeg: true, avgPrepTime: 10 },
  { name: 'Aloo Paratha', category: 'North Indian', price: 60, image: '🫓', description: 'Stuffed flatbread with butter', isVeg: true, avgPrepTime: 8 },
  { name: 'Rajma Rice', category: 'North Indian', price: 80, image: '🍱', description: 'Kidney beans curry with steamed rice', isVeg: true, avgPrepTime: 10 },

  // Chinese
  { name: 'Veg Fried Rice', category: 'Chinese', price: 80, image: '🍳', description: 'Indo-Chinese style fried rice', isVeg: true, avgPrepTime: 10 },
  { name: 'Veg Noodles', category: 'Chinese', price: 70, image: '🍜', description: 'Hakka noodles with vegetables', isVeg: true, avgPrepTime: 10 },
  { name: 'Gobi Manchurian', category: 'Chinese', price: 90, image: '🥦', description: 'Crispy cauliflower in spicy sauce', isVeg: true, avgPrepTime: 12 },
  { name: 'Veg Momos', category: 'Chinese', price: 80, image: '🥟', description: '6 steamed vegetable dumplings', isVeg: true, avgPrepTime: 15 },
  { name: 'Spring Rolls', category: 'Chinese', price: 60, image: '🌯', description: 'Crispy rolls with veggie filling', isVeg: true, avgPrepTime: 8 },

  // Quick Bites
  { name: 'Samosa', category: 'Quick Bites', price: 15, image: '🔺', description: 'Crispy pastry with potato filling', isVeg: true, avgPrepTime: 3 },
  { name: 'Bread Pakoda', category: 'Quick Bites', price: 20, image: '🍞', description: 'Bread fritter with chutneys', isVeg: true, avgPrepTime: 3 },
  { name: 'Pav Bhaji', category: 'Quick Bites', price: 60, image: '🫓', description: 'Spicy mashed vegetables with pav', isVeg: true, avgPrepTime: 8 },
  { name: 'Poha', category: 'Quick Bites', price: 30, image: '🍚', description: 'Light flattened rice snack', isVeg: true, avgPrepTime: 5 },
  { name: 'Upma', category: 'Quick Bites', price: 35, image: '🍲', description: 'Semolina breakfast dish', isVeg: true, avgPrepTime: 5 },

  // Non-Veg
  { name: 'Chicken Biryani', category: 'Non-Veg', price: 150, image: '🍗', description: 'Aromatic basmati rice with chicken', isVeg: false, avgPrepTime: 15 },
  { name: 'Chicken Curry', category: 'Non-Veg', price: 130, image: '🍗', description: 'Spicy home-style chicken curry', isVeg: false, avgPrepTime: 12 },
  { name: 'Mutton Keema', category: 'Non-Veg', price: 160, image: '🥩', description: 'Minced mutton with spices', isVeg: false, avgPrepTime: 15 },
  { name: 'Fish Fry', category: 'Non-Veg', price: 120, image: '🐟', description: 'Crispy fried fish with masala', isVeg: false, avgPrepTime: 10 },

  // Beverages
  { name: 'Masala Chai', category: 'Beverages', price: 15, image: '🍵', description: 'Spiced milk tea', isVeg: true, avgPrepTime: 3 },
  { name: 'Filter Coffee', category: 'Beverages', price: 20, image: '☕', description: 'South Indian filter coffee', isVeg: true, avgPrepTime: 3 },
  { name: 'Lassi', category: 'Beverages', price: 40, image: '🥛', description: 'Sweet or salted yogurt drink', isVeg: true, avgPrepTime: 3 },
  { name: 'Fresh Lime Soda', category: 'Beverages', price: 30, image: '🍋', description: 'Refreshing lime soda', isVeg: true, avgPrepTime: 2 },
  { name: 'Mango Juice', category: 'Beverages', price: 35, image: '🥭', description: 'Fresh mango juice', isVeg: true, avgPrepTime: 3 },

  // Thali
  { name: 'Veg Thali', category: 'Thali', price: 120, image: '🍱', description: 'Dal, sabzi, roti, rice, pickle', isVeg: true, avgPrepTime: 10 },
  { name: 'South Indian Thali', category: 'Thali', price: 100, image: '🍛', description: 'Sambar, rasam, rice, papad, pickle', isVeg: true, avgPrepTime: 10 },
  { name: 'Non-Veg Thali', category: 'Thali', price: 160, image: '🍽️', description: 'Chicken curry, dal, roti, rice', isVeg: false, avgPrepTime: 12 },

  // Chaats
  { name: 'Pani Puri', category: 'Chaats', price: 40, image: '🫧', description: '6 crispy puris with tangy water', isVeg: true, avgPrepTime: 5 },
  { name: 'Bhel Puri', category: 'Chaats', price: 35, image: '🌾', description: 'Puffed rice mix with chutneys', isVeg: true, avgPrepTime: 5 },
  { name: 'Sev Puri', category: 'Chaats', price: 40, image: '🌶️', description: 'Crispy puris with sev and chutney', isVeg: true, avgPrepTime: 5 },
  { name: 'Dahi Puri', category: 'Chaats', price: 45, image: '🫧', description: 'Puris with yogurt and chutneys', isVeg: true, avgPrepTime: 5 },

  // Egg Items
  { name: 'Egg Bhurji', category: 'Egg Items', price: 60, image: '🍳', description: 'Spicy scrambled eggs', isVeg: false, avgPrepTime: 5 },
  { name: 'Omelette', category: 'Egg Items', price: 40, image: '🍳', description: '2-egg omelette with masala', isVeg: false, avgPrepTime: 5 },
  { name: 'Egg Curry', category: 'Egg Items', price: 80, image: '🥚', description: 'Boiled eggs in spicy gravy', isVeg: false, avgPrepTime: 8 },
  { name: 'Boiled Eggs', category: 'Egg Items', price: 20, image: '🥚', description: '2 boiled eggs with salt & pepper', isVeg: false, avgPrepTime: 3 },

  // Ice Cream
  { name: 'Vanilla Ice Cream', category: 'Ice Cream', price: 30, image: '🍦', description: '2 scoops vanilla', isVeg: true, avgPrepTime: 2 },
  { name: 'Chocolate Ice Cream', category: 'Ice Cream', price: 35, image: '🍫', description: '2 scoops chocolate', isVeg: true, avgPrepTime: 2 },
  { name: 'Mango Kulfi', category: 'Ice Cream', price: 40, image: '🥭', description: 'Creamy mango kulfi bar', isVeg: true, avgPrepTime: 2 },
  { name: 'Ice Cream Sandwich', category: 'Ice Cream', price: 25, image: '🍪', description: 'Vanilla ice cream between cookies', isVeg: true, avgPrepTime: 2 },
];

const seedMenu = async () => {
  try {
    const count = await MenuItem.countDocuments();
    if (count === 0) {
      await MenuItem.insertMany(menuItems);
      console.log('✅ Menu seeded with', menuItems.length, 'items');
    }
    // Create default admin account if not exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@mingos.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Default admin created: admin@mingos.com / admin123');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};

module.exports = { seedMenu };
