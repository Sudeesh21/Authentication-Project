// File: backend/routes/auth.js

const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator'); 
const sendEmail = require('../utils/sendEmail');

// --- 1. REGISTER Endpoint ---
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!', user: { username, email, role } });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// --- 2. LOGIN Endpoint ---
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password." });
    }

    // --- OTP GENERATION ---
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false
    });
    
    user.otp = otp;
    user.otpExpires = Date.now() + 300000; // 5 minutes
    await user.save();

    console.log(`Generated OTP for ${user.email}: ${otp}`); // Log OTP to server console for testing

    // --- SEND EMAIL ---
    const emailSent = await sendEmail(
      user.email,
      'Your Login OTP',
      `Your One-Time Password is: ${otp}`
    );

    if (!emailSent) {
        return res.status(500).json({ 
            message: "Critical Error: Could not send email. Check Backend Logs." 
        });
    }

    // --- CRITICAL FIX: Send a clear "requiresOtp" flag ---
    res.status(200).json({ 
        message: "OTP sent to email.",
        requiresOtp: true, // Frontend will check for this!
        email: user.email 
    });

  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: "Server error during login." });
  }
});

// --- 3. VERIFY OTP Endpoint ---
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // Find user with matching Email AND OTP, and ensure OTP hasn't expired
    const user = await User.findOne({ 
      email: email,
      otp: otp,
      otpExpires: { $gt: Date.now() } 
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    
    res.status(200).json({ 
        message: "Login successful!", 
        token: token,
        user: { 
            id: user._id, 
            username: user.username, 
            email: user.email,
            role: user.role 
        }
    });

  } catch (err) {
    console.error('Error during OTP verification:', err);
    res.status(500).json({ message: "Server error during verification." });
  }
});

module.exports = router;
