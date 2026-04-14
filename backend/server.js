// =============================================
// MINGOS CANTEEN TOKENISATION SYSTEM - SERVER
// =============================================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ---- MIDDLEWARE ----
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- DATABASE CONNECTION ----
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mingos';
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected successfully');
    // Seed menu data on first run
    const { seedMenu } = require('./config/seedData');
    await seedMenu();
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

connectDB();

// ---- ROUTES ----
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// ---- HEALTH CHECK ----
app.get('/', (req, res) => {
  res.json({ 
    message: '🍽️ Mingos Canteen API is running!',
    version: '1.0.0',
    status: 'healthy'
  });
});

// ---- ERROR HANDLER ----
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Mingos server running on http://localhost:${PORT}`);
});

module.exports = app;
