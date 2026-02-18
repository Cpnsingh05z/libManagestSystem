import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Transactions = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Transactions</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' }}>
          
          <Link to="/transactions/search-books" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer' }}>
              <h3 style={{ color: '#4CAF50' }}>🔍 Search Available Books</h3>
              <p style={{ color: '#666' }}>Search for available books to issue</p>
            </div>
          </Link>

          <Link to="/transactions/issue-book" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer' }}>
              <h3 style={{ color: '#2196F3' }}>📤 Issue Book</h3>
              <p style={{ color: '#666' }}>Issue a book to a member</p>
            </div>
          </Link>

          <Link to="/transactions/return-book" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer' }}>
              <h3 style={{ color: '#FF9800' }}>📥 Return Book</h3>
              <p style={{ color: '#666' }}>Return a book and calculate fine</p>
            </div>
          </Link>

          <Link to="/transactions/active" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer' }}>
              <h3 style={{ color: '#9C27B0' }}>📋 Active Transactions</h3>
              <p style={{ color: '#666' }}>View all active book issues</p>
            </div>
          </Link>

        </div>
      </div>
    </>
  );
};

export default Transactions;
