// File: frontend/src/components/ForgotPassword.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [step, setStep] = useState(1); // Step 1: Send OTP, Step 2: Reset Password
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Use your Render URL or localhost
  const API_URL = 'https://authentication-backend-bz4u.onrender.com';

  // --- Step 1: Request OTP ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      setMessage("OTP sent! Check your email.");
      setStep(2); // Move to next step
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending OTP");
    }
  };

  // --- Step 2: Reset Password ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post(`${API_URL}/api/auth/reset-password`, { 
        email, 
        otp, 
        newPassword 
      });
      alert("Password Reset Successful! You can now login.");
      navigate('/login');
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid OTP or Error");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Reset Password</h2>
      <div className="auth-form-box">
        
        {/* VIEW 1: ENTER EMAIL */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            <label style={{fontWeight:'600', color:'#64748b'}}>Enter your email</label>
            <input 
              className="auth-input" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="name@company.com"
            />
            <button type="submit" className="auth-btn">Send OTP</button>
          </form>
        )}

        {/* VIEW 2: ENTER OTP & NEW PASSWORD */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
             <div style={{textAlign: 'center', color: '#64748b'}}>OTP sent to {email}</div>
             
             <input 
              className="auth-input" 
              type="text" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              required 
              placeholder="Enter 6-digit OTP" 
            />
            
            <input 
              className="auth-input" 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
              placeholder="New Password" 
            />
            
            <button type="submit" className="auth-btn">Reset Password</button>
            <button 
              type="button" 
              onClick={() => setStep(1)} 
              style={{background:'none', border:'none', color:'#64748b', cursor:'pointer', marginTop:'10px'}}
            >
              Back
            </button>
          </form>
        )}

        {message && <div style={{color: 'red', textAlign: 'center', marginTop: '10px'}}>{message}</div>}

        <div className="auth-link">
          Remembered it? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
