import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../utils/api';

const AddMembership = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    membershipType: '6months'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.membershipType) {
      setError('All fields are mandatory');
      return;
    }

    try {
      const response = await API.post('/members', formData);
      setSuccess(`Membership added successfully! Membership Number: ${response.data.data.membershipNumber}`);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        membershipType: '6months'
      });
      setTimeout(() => navigate('/maintenance'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add membership');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Add Membership</h1>
        
        <div className="card">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter member name"
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group">
              <label>Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Membership Type *</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="membershipType"
                    value="6months"
                    checked={formData.membershipType === '6months'}
                    onChange={handleChange}
                  />
                  6 Months
                </label>
                <label>
                  <input
                    type="radio"
                    name="membershipType"
                    value="1year"
                    checked={formData.membershipType === '1year'}
                    onChange={handleChange}
                  />
                  1 Year
                </label>
                <label>
                  <input
                    type="radio"
                    name="membershipType"
                    value="2years"
                    checked={formData.membershipType === '2years'}
                    onChange={handleChange}
                  />
                  2 Years
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">Add Membership</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/maintenance')}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddMembership;
