import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../utils/api';

const UpdateMembership = () => {
  const [membershipNumber, setMembershipNumber] = useState('');
  const [memberData, setMemberData] = useState(null);
  const [extensionType, setExtensionType] = useState('6months');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    setError('');
    if (!membershipNumber) {
      setError('Membership number is mandatory');
      return;
    }

    try {
      const response = await API.get(`/members/${membershipNumber}`);
      setMemberData(response.data.data);
    } catch (err) {
      setError('Member not found');
      setMemberData(null);
    }
  };

  const handleExtend = async () => {
    setError('');
    setSuccess('');

    try {
      await API.put(`/members/${membershipNumber}/extend`, { extensionType });
      setSuccess('Membership extended successfully!');
      handleSearch();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to extend membership');
    }
  };

  const handleCancel = async () => {
    setError('');
    setSuccess('');

    if (window.confirm('Are you sure you want to cancel this membership?')) {
      try {
        await API.put(`/members/${membershipNumber}/cancel`);
        setSuccess('Membership cancelled successfully!');
        setTimeout(() => navigate('/maintenance'), 2000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to cancel membership');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Update Membership</h1>
        
        <div className="card">
          <div className="form-group">
            <label>Membership Number *</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={membershipNumber}
                onChange={(e) => setMembershipNumber(e.target.value)}
                placeholder="Enter membership number"
                style={{ flex: 1 }}
              />
              <button className="btn btn-secondary" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {memberData && (
          <div className="card">
            <h3>Member Details</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <p><strong>Name:</strong> {memberData.name}</p>
              <p><strong>Email:</strong> {memberData.email}</p>
              <p><strong>Phone:</strong> {memberData.phone}</p>
              <p><strong>Address:</strong> {memberData.address}</p>
              <p><strong>Current Membership:</strong> {memberData.membershipType}</p>
              <p><strong>Start Date:</strong> {new Date(memberData.startDate).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(memberData.endDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> <span style={{ 
                color: memberData.status === 'active' ? 'green' : 'red',
                fontWeight: 'bold'
              }}>{memberData.status.toUpperCase()}</span></p>
            </div>

            <hr />

            <h4 style={{ marginTop: '20px' }}>Extend Membership</h4>
            <div className="form-group">
              <label>Extension Period</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    value="6months"
                    checked={extensionType === '6months'}
                    onChange={(e) => setExtensionType(e.target.value)}
                  />
                  6 Months
                </label>
                <label>
                  <input
                    type="radio"
                    value="1year"
                    checked={extensionType === '1year'}
                    onChange={(e) => setExtensionType(e.target.value)}
                  />
                  1 Year
                </label>
                <label>
                  <input
                    type="radio"
                    value="2years"
                    checked={extensionType === '2years'}
                    onChange={(e) => setExtensionType(e.target.value)}
                  />
                  2 Years
                </label>
              </div>
            </div>

            <button className="btn btn-primary" onClick={handleExtend}>
              Extend Membership
            </button>
            <button className="btn btn-danger" onClick={handleCancel}>
              Cancel Membership
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/maintenance')}>
              Back
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default UpdateMembership;
