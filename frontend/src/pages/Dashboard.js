import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await API.get('/reports/dashboard');
      setStats(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '60vh',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div className="loader"></div>
            <p style={{ color: 'white', fontSize: '18px', fontWeight: '500' }}>Loading Dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="dashboard-header">
          <h1>📊 Dashboard Overview</h1>
          <p className="dashboard-subtitle">Welcome back! Here's what's happening in your library today.</p>
        </div>
        
        <div className="dashboard-stats">
          <div className="stat-card stat-card-1">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <h3>Total Books</h3>
              <p>{stats?.totalBooks || 0}</p>
            </div>
          </div>

          <div className="stat-card stat-card-2">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Available Books</h3>
              <p>{stats?.availableBooks || 0}</p>
            </div>
          </div>

          <div className="stat-card stat-card-3">
            <div className="stat-icon">📤</div>
            <div className="stat-content">
              <h3>Issued Books</h3>
              <p>{stats?.issuedBooks || 0}</p>
            </div>
          </div>

          <div className="stat-card stat-card-4">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Total Members</h3>
              <p>{stats?.totalMembers || 0}</p>
            </div>
          </div>

          <div className="stat-card stat-card-5">
            <div className="stat-icon">🔄</div>
            <div className="stat-content">
              <h3>Active Transactions</h3>
              <p>{stats?.activeTransactions || 0}</p>
            </div>
          </div>

          <div className="stat-card stat-card-6">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <h3>Overdue Books</h3>
              <p>{stats?.overdueTransactions || 0}</p>
            </div>
          </div>

          <div className="stat-card stat-card-7">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Fine Collected</h3>
              <p>₹{stats?.totalFineCollected || 0}</p>
            </div>
          </div>

          <div className="stat-card stat-card-8">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>Pending Fine</h3>
              <p>₹{stats?.pendingFine || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
