import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../utils/api';

const IssueBook = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    bookSerialNumber: '',
    bookTitle: '',
    bookAuthor: '',
    membershipNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    returnDate: '',
    remarks: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (location.state?.book) {
      const book = location.state.book;
      const today = new Date();
      const returnDate = new Date(today);
      returnDate.setDate(returnDate.getDate() + 15);
      
      setFormData({
        ...formData,
        bookSerialNumber: book.serialNumber,
        bookTitle: book.title,
        bookAuthor: book.author,
        returnDate: returnDate.toISOString().split('T')[0]
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'issueDate') {
      if (!value) {
        setFormData({ ...formData, issueDate: value, returnDate: '' });
        return;
      }
      
      const issueDate = new Date(value);
      if (isNaN(issueDate.getTime())) {
        setFormData({ ...formData, issueDate: value, returnDate: '' });
        return;
      }
      
      const returnDate = new Date(issueDate);
      returnDate.setDate(returnDate.getDate() + 15);
      
      setFormData({
        ...formData,
        issueDate: value,
        returnDate: returnDate.toISOString().split('T')[0]
      });
    } else if (name === 'returnDate') {
      if (!value || !formData.issueDate) {
        setFormData({ ...formData, [name]: value });
        return;
      }
      
      const issueDate = new Date(formData.issueDate);
      const selectedReturnDate = new Date(value);
      
      if (isNaN(issueDate.getTime()) || isNaN(selectedReturnDate.getTime())) {
        setFormData({ ...formData, [name]: value });
        return;
      }
      
      const maxReturnDate = new Date(issueDate);
      maxReturnDate.setDate(maxReturnDate.getDate() + 15);
      
      if (selectedReturnDate > maxReturnDate) {
        setError('Return date cannot be greater than 15 days from issue date');
        return;
      }
      setError('');
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.bookTitle || !formData.membershipNumber || !formData.issueDate) {
      setError('Please make a valid selection. Book name, membership number and issue date are required.');
      return;
    }

    // Validation removed for testing overdue - allow past dates
    // const today = new Date();
    // today.setHours(0, 0, 0, 0);
    // const issueDate = new Date(formData.issueDate);
    // 
    // if (issueDate < today) {
    //   setError('Issue date cannot be earlier than today');
    //   return;
    // }

    try {
      await API.post('/transactions/issue', {
        bookSerialNumber: formData.bookSerialNumber,
        membershipNumber: formData.membershipNumber,
        issueDate: formData.issueDate,
        returnDate: formData.returnDate,
        remarks: formData.remarks
      });
      
      setSuccess('Book issued successfully!');
      setTimeout(() => navigate('/transactions'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue book');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Issue Book</h1>
        
        <div className="card">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Book Serial Number</label>
              <input
                type="text"
                name="bookSerialNumber"
                value={formData.bookSerialNumber}
                onChange={handleChange}
                placeholder="Enter book serial number"
              />
            </div>

            <div className="form-group">
              <label>Book Name *</label>
              <input
                type="text"
                name="bookTitle"
                value={formData.bookTitle}
                onChange={handleChange}
                placeholder="Enter book name"
              />
            </div>

            <div className="form-group">
              <label>Author Name (Auto-populated)</label>
              <input
                type="text"
                name="bookAuthor"
                value={formData.bookAuthor}
                readOnly
                placeholder="Author name will be auto-populated"
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
              <label>Issue Date *</label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Return Date (Auto-populated, max 15 days from issue date)</label>
              <input
                type="date"
                name="returnDate"
                value={formData.returnDate}
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

            <button type="submit" className="btn btn-primary">Issue Book</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/transactions')}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default IssueBook;
