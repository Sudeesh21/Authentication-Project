// File: backend/index.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// --- 1. Import your new route file ---
const authRoutes = require('./routes/auth');

// Load environment variables
dotenv.config(); 
    
const app = express();
    
// Middlewares
app.use(cors()); 
app.use(express.json()); 

// --- 2. Connect to MongoDB ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB is connected successfully!');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

connectDB();
// ---------------------------------

// --- 3. "Use" the routes ---
// This tells Express that any URL starting with /api/auth
// should be handled by the 'authRoutes' file.
app.use('/api/auth', authRoutes);

// A simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// --- 4. Start the server ---
const PORT = process.env.PORT || 5000;
    
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});