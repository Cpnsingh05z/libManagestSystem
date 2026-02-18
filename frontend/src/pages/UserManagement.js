import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../utils/api';

const UserManagement = () => {
  const [mode, setMode] = useState('new');
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (mode === 'existing') {
      fetchUsers();
    }
  }, [mode]);

  const fetchUsers = async () => {
    try {
      const response = await API.get('/auth/users');
      setUsers(response.data.data);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name) {
      setError('Name is mandatory');
      return;
    }

    if (mode === 'new' && (!formData.username || !formData.password)) {
      setError('Username and password are required for new user');
      return;
    }

    try {
      await API.post('/auth/register', formData);
      setSuccess('User created successfully!');
      setFormData({
        name: '',
        username: '',
        password: '',
        role: 'user'
      });
      if (mode === 'existing') {
        fetchUsers();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>User Management</h1>
        
        <div className="card">
          <div className="form-group">
            <label>Mode</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="new"
                  checked={mode === 'new'}
                  onChange={(e) => setMode(e.target.value)}
                />
                New User
              </label>
              <label>
                <input
                  type="radio"
                  value="existing"
                  checked={mode === 'existing'}
                  onChange={(e) => setMode(e.target.value)}
                />
                Existing Users
              </label>
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {mode === 'new' && (
          <div className="card">
            <h3>Create New User</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                />
              </div>

              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                />
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary">Create User</button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/maintenance')}>
                Cancel
              </button>
            </form>
          </div>
        )}

        {mode === 'existing' && (
          <div className="card">
            <h3>Existing Users</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.username}</td>
                      <td>{user.role}</td>
                      <td>{user.isActive ? 'Active' : 'Inactive'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserManagement;
