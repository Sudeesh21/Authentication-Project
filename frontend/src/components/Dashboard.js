// File: frontend/src/components/Dashboard.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('dashboard'); 
  
  // --- SETTINGS STATE ---
  const [darkMode, setDarkMode] = useState(false);
  const [headerColor, setHeaderColor] = useState(''); // Stores custom color
  const [sidebarColor, setSidebarColor] = useState(''); // Stores custom color

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  const getPageTitle = () => {
    switch(activeView) {
      case 'dashboard': return 'Overview';
      case 'profile': return 'My Profile';
      case 'team': return 'Team Members';
      case 'settings': return 'Tools & Appearance';
      default: return 'Dashboard';
    }
  };

  if (!user) return <div>Loading...</div>;

  // --- DYNAMIC STYLES OBJECT ---
  // This overrides CSS variables based on user settings
  const customStyles = {
    '--header-bg': headerColor || (darkMode ? '#1e293b' : '#ffffff'),
    '--bg-sidebar': sidebarColor || (darkMode ? '#1e293b' : '#ffffff'),
  };

  const renderContent = () => {
    switch (activeView) {
      case 'profile':
        return (
          <div className="stat-card">
            <table className="info-table">
              <tbody>
                <tr><td>Username</td><td>{user.username}</td></tr>
                <tr><td>Email</td><td>{user.email || "Re-login to see email"}</td></tr>
                <tr><td>Role</td><td>{user.role}</td></tr>
                <tr><td>Account ID</td><td>{user.id}</td></tr>
                <tr><td>Status</td><td><span style={{color: '#22c55e', fontWeight:'bold'}}>Active</span></td></tr>
              </tbody>
            </table>
          </div>
        );
      
      case 'team':
        return (
          <div>
            <div className="stats-row">
              <div className="stat-card">
                <div style={{fontWeight: 'bold'}}>Sarah Smith</div>
                <div className="stat-desc">Lead Designer</div>
              </div>
              <div className="stat-card">
                <div style={{fontWeight: 'bold'}}>John Doe</div>
                <div className="stat-desc">Backend Dev</div>
              </div>
              <div className="stat-card">
                <div style={{fontWeight: 'bold'}}>Mike Ross</div>
                <div className="stat-desc">Product Manager</div>
              </div>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="stat-card">
            <h3 style={{marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px'}}>
              Global Appearance
            </h3>

            <div className="settings-grid">
              <div className="settings-label">Theme Mode</div>
              <div>
                <button 
                  className="auth-btn" 
                  style={{width: 'auto', backgroundColor: darkMode ? '#fbbf24' : '#1e293b'}}
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? "☀️ Switch to Light Mode" : "🌙 Switch to Dark Mode"}
                </button>
              </div>
            </div>

            {/* --- WORKING COLOR PICKERS --- */}
            <div className="settings-grid">
              <div className="settings-label">Header Color</div>
              <input 
                type="color" 
                className="settings-input" 
                value={headerColor}
                onChange={(e) => setHeaderColor(e.target.value)}
                style={{height: '40px', padding: '0'}} 
              />
            </div>

            <div className="settings-grid">
              <div className="settings-label">Sidebar Color</div>
              <input 
                type="color" 
                className="settings-input" 
                value={sidebarColor}
                onChange={(e) => setSidebarColor(e.target.value)}
                style={{height: '40px', padding: '0'}} 
              />
            </div>

            <div className="settings-grid">
              <div className="settings-label">Font Style</div>
              <select className="settings-input">
                <option>Inter (Default)</option>
                <option>Roboto</option>
                <option>Open Sans</option>
              </select>
            </div>

            <div className="settings-grid">
              <div className="settings-label">Reset</div>
              <button 
                className="auth-btn" 
                style={{width: 'auto', background: '#ef4444'}}
                onClick={() => { setHeaderColor(''); setSidebarColor(''); setDarkMode(false); }}
              >
                Reset to Default
              </button>
            </div>

          </div>
        );

      default: // 'dashboard'
        return (
          <>
             {/* --- RESTORED COLORFUL STATS --- */}
             <div className="stats-row">
               <div className="stat-card" style={{borderLeft: '4px solid #34d399'}}>
                 <div className="stat-num">12</div>
                 <div className="stat-desc">Pending Tasks</div>
               </div>
               <div className="stat-card" style={{borderLeft: '4px solid #60a5fa'}}>
                 <div className="stat-num">5</div>
                 <div className="stat-desc">Active Projects</div>
               </div>
               <div className="stat-card" style={{borderLeft: '4px solid #f472b6'}}>
                 <div className="stat-num">98%</div>
                 <div className="stat-desc">Customer Satisfaction</div>
               </div>
               <div className="stat-card" style={{borderLeft: '4px solid #fbbf24'}}>
                 <div className="stat-num">$12k</div>
                 <div className="stat-desc">Revenue this month</div>
               </div>
             </div>
 
             {/* --- RESTORED INTERACTIVE TASKS --- */}
             <h3>{user.role === 'manager' ? 'Manager Actions' : 'Employee Tasks'}</h3>
             <div className="stats-row">
               {user.role === 'manager' ? (
                 <>
                    <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => alert('Opening Review Module...')}>
                       <h4>📝 Review Reports</h4>
                       <p className="stat-desc">Check weekly submissions</p>
                    </div>
                    <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => alert('Opening Team Settings...')}>
                       <h4>⚙️ Team Config</h4>
                       <p className="stat-desc">Manage access levels</p>
                    </div>
                 </>
               ) : (
                 <>
                    <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => alert('Clocking in...')}>
                       <h4>⏰ Clock In</h4>
                       <p className="stat-desc">Start your shift</p>
                    </div>
                    <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => alert('Opening Leave Form...')}>
                       <h4>📅 Request Leave</h4>
                       <p className="stat-desc">Apply for time off</p>
                    </div>
                 </>
               )}
             </div>
           </>
        );
    }
  };

  return (
    // --- APPLY CUSTOM STYLES & DARK MODE CLASS HERE ---
    <div className={`dashboard-container ${darkMode ? 'dark-mode' : ''}`} style={customStyles}>
      
      {/* SIDEBAR */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        {/* CHANGED TITLE TO MENU */}
        <div className="sidebar-header">Menu</div>
        
        <div style={{marginTop: '20px'}}>
          <div className={`menu-item ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveView('dashboard')}>
            <span className="menu-icon">🏠</span> Dashboard
          </div>
          <div className={`menu-item ${activeView === 'profile' ? 'active' : ''}`} onClick={() => setActiveView('profile')}>
            <span className="menu-icon">👨🏻‍💼</span> My Profile
          </div>
          <div className={`menu-item ${activeView === 'team' ? 'active' : ''}`} onClick={() => setActiveView('team')}>
            <span className="menu-icon">👨‍👨</span> Team
          </div>
          <div className={`menu-item ${activeView === 'settings' ? 'active' : ''}`} onClick={() => setActiveView('settings')}>
            <span className="menu-icon">⚙️</span> Settings
          </div>
        </div>
        <div style={{marginTop: 'auto', padding: '20px'}}>
           <div className="menu-item" onClick={handleLogout} style={{color: '#ef4444'}}>
            <span className="menu-icon">🚪</span> Logout
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className={`main-content ${!isSidebarOpen ? 'full-width' : ''}`}>
        
        {/* TOP BAR */}
        <div className="top-bar">
          <div style={{display: 'flex', alignItems: 'center'}}>
            <button className="hamburger-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>☰</button>
            <div className="page-title">{getPageTitle()}</div>
          </div>
          
          <div style={{display:'flex', gap: '15px', alignItems:'center'}}>
            {/* TEXT COLOR HANDLED BY CSS VARS */}
            <span style={{fontWeight: '500'}}>{user.username}</span>
            <span className="role-badge">{user.role}</span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="content-area">
          {renderContent()}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;