import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../utils/api';

const PayFine = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [finePaid, setFinePaid] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (location.state?.transaction) {
      setTransaction(location.state.transaction);
      setRemarks(location.state.transaction.remarks || '');
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (transaction.fine > 0 && !finePaid) {
      setError('Please make a valid selection. Fine must be paid before completing the transaction.');
      return;
    }

    try {
      await API.post('/transactions/pay-fine', {
        transactionId: transaction._id,
        finePaid,
        remarks
      });
      
      setSuccess('Transaction completed successfully!');
      setTimeout(() => navigate('/transactions'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete transaction');
    }
  };

  if (!transaction) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="error-message">No transaction data found</div>
          <button className="btn btn-secondary" onClick={() => navigate('/transactions')}>
            Back to Transactions
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Pay Fine</h1>
        
        <div className="card">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <h3>Transaction Details</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <p><strong>Book Title:</strong> {transaction.bookTitle}</p>
            <p><strong>Author:</strong> {transaction.bookAuthor}</p>
            <p><strong>Serial Number:</strong> {transaction.bookSerialNumber}</p>
            <p><strong>Member Name:</strong> {transaction.memberName}</p>
            <p><strong>Membership Number:</strong> {transaction.membershipNumber}</p>
            <p><strong>Issue Date:</strong> {new Date(transaction.issueDate).toLocaleDateString()}</p>
            <p><strong>Expected Return Date:</strong> {new Date(transaction.expectedReturnDate).toLocaleDateString()}</p>
            <p><strong>Actual Return Date:</strong> {new Date(transaction.actualReturnDate).toLocaleDateString()}</p>
            <p><strong>Fine Amount:</strong> <span style={{ 
              color: transaction.fine > 0 ? 'red' : 'green',
              fontWeight: 'bold',
              fontSize: '18px'
            }}>₹{transaction.fine}</span></p>
          </div>

          <form onSubmit={handleSubmit}>
            {transaction.fine > 0 && (
              <div className="form-group">
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={finePaid}
                      onChange={(e) => setFinePaid(e.target.checked)}
                    />
                    Fine Paid *
                  </label>
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Remarks (Optional)</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter any remarks"
                rows="3"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Confirm Transaction
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/transactions')}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PayFine;
