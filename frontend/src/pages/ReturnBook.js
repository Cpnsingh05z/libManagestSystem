import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../utils/api';

const ReturnBook = () => {
  const [formData, setFormData] = useState({
    bookSerialNumber: '',
    membershipNumber: '',
    actualReturnDate: new Date().toISOString().split('T')[0],
    remarks: ''
  });
  const [transactionData, setTransactionData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.bookSerialNumber || !formData.membershipNumber) {
      setError('Please make a valid selection. Book serial number and membership number are required.');
      return;
    }

    try {
      const response = await API.post('/transactions/return', formData);
      const transaction = response.data.data;
      
      if (response.data.requiresFinePayment) {
        navigate('/transactions/pay-fine', { state: { transaction } });
      } else {
        navigate('/transactions/pay-fine', { state: { transaction } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to return book');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Return Book</h1>
        
        <div className="card">
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Book Serial Number *</label>
              <input
                type="text"
                name="bookSerialNumber"
                value={formData.bookSerialNumber}
                onChange={handleChange}
                placeholder="Enter book serial number"
              />
            </div>

            <div className="form-group">
              <label>Membership Number *</label>
              <input
                type="text"
                name="membershipNumber"
                value={formData.membershipNumber}
                onChange={handleChange}
                placeholder="Enter membership number"
              />
            </div>

            <div className="form-group">
              <label>Return Date</label>
              <input
                type="date"
                name="actualReturnDate"
                value={formData.actualReturnDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Remarks (Optional)</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Enter any remarks"
                rows="3"
              />
            </div>

            <button type="submit" className="btn btn-primary">Confirm Return</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/transactions')}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ReturnBook;
