import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../utils/api';

const ActiveTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await API.get('/transactions/active');
      setTransactions(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Active Transactions</h1>
        
        <div className="card">
          {transactions.length === 0 ? (
            <p>No active transactions found</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Book Title</th>
                    <th>Author</th>
                    <th>Serial No</th>
                    <th>Member Name</th>
                    <th>Membership No</th>
                    <th>Issue Date</th>
                    <th>Expected Return</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => {
                    const isOverdue = new Date(transaction.expectedReturnDate) < new Date();
                    return (
                      <tr key={transaction._id}>
                        <td>{transaction.bookTitle}</td>
                        <td>{transaction.bookAuthor}</td>
                        <td>{transaction.bookSerialNumber}</td>
                        <td>{transaction.memberName}</td>
                        <td>{transaction.membershipNumber}</td>
                        <td>{new Date(transaction.issueDate).toLocaleDateString()}</td>
                        <td>{new Date(transaction.expectedReturnDate).toLocaleDateString()}</td>
                        <td>
                          <span style={{ 
                            color: isOverdue ? 'red' : 'green',
                            fontWeight: 'bold'
                          }}>
                            {isOverdue ? 'OVERDUE' : 'ACTIVE'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          
          <button className="btn btn-secondary" onClick={() => navigate('/transactions')} style={{ marginTop: '20px' }}>
            Back
          </button>
        </div>
      </div>
    </>
  );
};

export default ActiveTransactions;
