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

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the user
    const newUser = new User({ username, email, password: hashedPassword, role });
    const savedUser = await newUser.save();

    res.status(201).json({ message: 'User registered successfully!', user: savedUser });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// --- 2. LOGIN Endpoint (Generates OTP) ---
router.post('/login', async (req, res) => {
  try {
    // Find the user
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password." });
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false
    });
    
    // Save OTP to Database
    user.otp = otp;
    user.otpExpires = Date.now() + 300000; // Expires in 5 minutes
    await user.save();

    // Send OTP via Email
    await sendEmail(
      user.email,
      'Your Login OTP',
      `Your One-Time Password is: ${otp}`
    );

    // Send response to Frontend to trigger the OTP Input view
    res.status(200).json({ 
        message: "OTP has been sent to your email. Please verify."
    });

  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: "Server error during login." });
  }
});

// --- 3. VERIFY OTP Endpoint (Final Login) ---
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

    // Generate the JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Clear the OTP from the database (security best practice)
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    
    // Send the token and user data
    res.status(200).json({ 
        message: "Login successful!", 
        token: token,
        user: { 
            id: user._id, 
            username: user.username, 
            email: user.email, // <--- IMPORTANT: Include email here for the Profile page
            role: user.role 
        }
    });

  } catch (err) {
    console.error('Error during OTP verification:', err);
    res.status(500).json({ message: "Server error during verification." });
  }
});

module.exports = router;