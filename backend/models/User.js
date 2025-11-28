// File: backend/models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['employee', 'manager'], // Only allows these two values
    default: 'employee'
  },
  
  // --- NEW FIELDS FOR OTP ---
  otp: {
    type: String,
    required: false // Not required, only set during login attempt
  },
  otpExpires: {
    type: Date,
    required: false // Not required
  }
  // -------------------------

}, { timestamps: true }); // Automatically adds 'createdAt' and 'updatedAt'

module.exports = mongoose.model('User', UserSchema);