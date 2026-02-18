import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Maintenance = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Maintenance Module</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' }}>
          
          <Link to="/maintenance/add-book" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.3s', ':hover': { transform: 'scale(1.05)' } }}>
              <h3 style={{ color: '#4CAF50' }}>📚 Add Book</h3>
              <p style={{ color: '#666' }}>Add new books or movies to the library</p>
            </div>
          </Link>

          <Link to="/maintenance/update-book" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer' }}>
              <h3 style={{ color: '#2196F3' }}>✏️ Update Book</h3>
              <p style={{ color: '#666' }}>Update existing book details</p>
            </div>
          </Link>

          <Link to="/maintenance/add-membership" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer' }}>
              <h3 style={{ color: '#FF9800' }}>👤 Add Membership</h3>
              <p style={{ color: '#666' }}>Register new library members</p>
            </div>
          </Link>

          <Link to="/maintenance/update-membership" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer' }}>
              <h3 style={{ color: '#9C27B0' }}>🔄 Update Membership</h3>
              <p style={{ color: '#666' }}>Extend or cancel memberships</p>
            </div>
          </Link>

          <Link to="/maintenance/user-management" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer' }}>
              <h3 style={{ color: '#f44336' }}>👥 User Management</h3>
              <p style={{ color: '#666' }}>Manage system users</p>
            </div>
          </Link>

        </div>
      </div>
    </>
  );
};

export default Maintenance;
