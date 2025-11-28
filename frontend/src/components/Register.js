// File: frontend/src/components/Register.js

import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'employee' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://authentication-backend-bz4u.onrender.com/api/auth/register', formData);
      setMessage('User registered successfully! Please Login.');
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      
      <h2 className="auth-title">Create Account</h2>

      <div className="auth-form-box">
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          
          <input className="auth-input" type="text" name="username" placeholder="Username" onChange={handleChange} required />
          <input className="auth-input" type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
          <input className="auth-input" type="password" name="password" placeholder="Password" onChange={handleChange} required />
          
          <select className="auth-input" name="role" onChange={handleChange}>
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>

          <button type="submit" className="auth-btn">Register</button>
        </form>

        {message && <div style={{color: 'green', textAlign: 'center', fontWeight: 'bold'}}>{message}</div>}

        <div className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;