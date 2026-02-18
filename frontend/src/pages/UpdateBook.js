import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../utils/api';

const UpdateBook = () => {
  const [serialNumber, setSerialNumber] = useState('');
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    setError('');
    if (!serialNumber) {
      setError('Please enter serial number');
      return;
    }

    try {
      const response = await API.get(`/books/${serialNumber}`);
      setFormData(response.data.data);
    } catch (err) {
      setError('Book not found');
      setFormData(null);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.type || !formData.title || !formData.author || !formData.category || 
        !formData.publisher || !formData.publicationYear || !formData.isbn || !formData.totalCopies) {
      setError('All fields are mandatory. Please enter all details.');
      return;
    }

    try {
      await API.put(`/books/${formData.serialNumber}`, formData);
      setSuccess('Book updated successfully!');
      setTimeout(() => navigate('/maintenance'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update book');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Update Book / Movie</h1>
        
        <div className="card">
          <div className="form-group">
            <label>Serial Number</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="Enter book serial number"
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

        {formData && (
          <div className="card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Type *</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="type"
                      value="book"
                      checked={formData.type === 'book'}
                      onChange={handleChange}
                    />
                    Book
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="type"
                      value="movie"
                      checked={formData.type === 'movie'}
                      onChange={handleChange}
                    />
                    Movie
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Author *</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Publisher *</label>
                <input
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Publication Year *</label>
                <input
                  type="number"
                  name="publicationYear"
                  value={formData.publicationYear}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>ISBN *</label>
                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Total Copies *</label>
                <input
                  type="number"
                  name="totalCopies"
                  value={formData.totalCopies}
                  onChange={handleChange}
                  min="1"
                />
              </div>

              <button type="submit" className="btn btn-primary">Update Book</button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/maintenance')}>
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default UpdateBook;
