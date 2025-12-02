// File: frontend/src/components/Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false); 
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Use the environment variable for URL (Localhost or Render)
  // If running locally, you might need to hardcode 'http://localhost:5000' if .env isn't set
  const API_URL = 'https://authentication-backend-bz4u.onrender.com';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // --- STEP 1: LOGIN (Password Check) ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      // Make sure we are hitting the correct URL
      const response = await axios.post(`${API_URL}/api/auth/login`, formData);
      
      console.log("Backend Response:", response.data); // Debugging Log

      // --- CRITICAL CHECK ---
      // We now check the boolean flag, not the text message
      if (response.data.requiresOtp === true) {
        setMessage("Password correct. Please enter the OTP sent to your email.");
        setShowOtpInput(true); // Switch to OTP Form
      } else {
        // Fallback: If for some reason OTP isn't required by backend logic
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/dashboard');
      }

    } catch (error) {
      console.error("Login Error:", error);
      setMessage(error.response?.data?.message || "Login failed. Check console.");
    }
  };

  // --- STEP 2: VERIFY OTP ---
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await axios.post(`${API_URL}/api/auth/verify-otp`, {
        email: formData.email,
        otp: otp
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');

    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">
        {showOtpInput ? "Security Verification" : "Login"}
      </h2>

      <div className="auth-form-box">
        {/* FORM 1: EMAIL & PASSWORD */}
        {!showOtpInput ? (
          <form onSubmit={handleLoginSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            <div>
              <label style={{fontSize: '0.9rem', fontWeight: '600', color: '#64748b'}}>Email Address</label>
              <input
                className="auth-input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label style={{fontSize: '0.9rem', fontWeight: '600', color: '#64748b'}}>Password</label>
              <input
                className="auth-input"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="auth-btn">Sign In</button>
          </form>
        ) : (
          /* FORM 2: OTP INPUT */
          <form onSubmit={handleOtpSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            <div style={{textAlign: 'center', color: '#64748b', marginBottom: '10px'}}>
              Enter the 6-digit code sent to <strong>{formData.email}</strong>
            </div>

            <div>
              <label style={{fontSize: '0.9rem', fontWeight: '600', color: '#64748b'}}>One-Time Password</label>
              <input
                className="auth-input"
                type="text"
                name="otp"
                value={otp}
                onChange={handleOtpChange}
                required
                placeholder="123456"
                maxLength="6"
                style={{letterSpacing: '5px', textAlign: 'center', fontSize: '1.2rem'}}
              />
            </div>

            <button type="submit" className="auth-btn">Verify & Login</button>
            <button 
              type="button" 
              onClick={() => setShowOtpInput(false)} 
              style={{background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginTop: '10px'}}
            >
              Back to Login
            </button>
          </form>
        )}

        {message && (
            <div className="message-box" style={{fontSize: '0.9rem', padding: '10px', marginTop: '10px'}}>
                {message}
            </div>
        )}

        {!showOtpInput && (
          <div className="auth-link">
            Don't have an account? <Link to="/register">Register here</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
