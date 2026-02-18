import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar">
      <h2>Library Management System</h2>
      <nav>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Dashboard
        </NavLink>
        
        {user?.role === 'admin' && (
          <NavLink to="/maintenance" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Maintenance
          </NavLink>
        )}
        
        <NavLink to="/transactions" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Transactions
        </NavLink>
        
        <NavLink to="/reports" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Reports
        </NavLink>
        
        <span style={{ 
          marginLeft: '20px', 
          color: '#1a202c', 
          fontWeight: '600', 
          background: user?.role === 'admin' ? '#e8f0fe' : '#e6ffed', 
          padding: '8px 16px', 
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {user?.role === 'admin' ? '👨‍💼' : '👤'} {user?.name} 
          <span style={{ 
            fontSize: '11px', 
            opacity: 0.7, 
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            ({user?.role})
          </span>
        </span>
        
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Navbar;
