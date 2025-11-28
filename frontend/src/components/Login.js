// File: frontend/src/components/Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  // State for Login Inputs
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  // State for OTP Logic
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false); // Controls which form to show
  
  // UI State
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Handle text changes for Email/Password
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle text changes for OTP
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // --- STEP 1: SUBMIT EMAIL & PASSWORD ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await axios.post('https://authentication-backend-bz4u.onrender.com/api/auth/login', formData);
      
      // If backend says "OTP sent", we switch the form
      if (response.data.message.includes("OTP")) {
        setMessage(response.data.message);
        setShowOtpInput(true); // <--- THIS SWITCHES THE VIEW
      } else {
        // Fallback if you turned off OTP in backend
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/dashboard');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  // --- STEP 2: SUBMIT OTP ---
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await axios.post('https://authentication-backend-bz4u.onrender.com/api/auth/verify-otp', {
        email: formData.email,
        otp: otp
      });

      // If OTP is correct, we get the token
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      navigate('/dashboard'); // <--- REDIRECT TO DASHBOARD
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="auth-container">
      
      {/* The Title is OUTSIDE the box */}
      <h2 className="auth-title">
        {showOtpInput ? "Security Verification" : "Login"}
      </h2>

      {/* The White Box */}
      <div className="auth-form-box">
        
        {/* --- FORM 1: EMAIL & PASSWORD --- */}
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
          
          /* --- FORM 2: OTP INPUT --- */
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
                placeholder="Enter OTP"
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

        {/* Success/Error Message */}
        {message && (
            <div className="message-box" style={{fontSize: '0.9rem', padding: '10px', marginTop: '10px'}}>
                {message}
            </div>
        )}

        {/* Hide Register link if showing OTP to keep it clean */}
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