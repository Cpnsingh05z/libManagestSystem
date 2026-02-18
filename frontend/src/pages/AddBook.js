import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../utils/api';

const AddBook = () => {
  const [formData, setFormData] = useState({
    type: 'book',
    title: '',
    author: '',
    category: '',
    publisher: '',
    publicationYear: '',
    isbn: '',
    totalCopies: ''
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

    if (!formData.type || !formData.title || !formData.author || !formData.category || 
        !formData.publisher || !formData.publicationYear || !formData.isbn || !formData.totalCopies) {
      setError('All fields are mandatory. Please enter all details.');
      return;
    }

    try {
      await API.post('/books', formData);
      setSuccess('Book added successfully!');
      setFormData({
        type: 'book',
        title: '',
        author: '',
        category: '',
        publisher: '',
        publicationYear: '',
        isbn: '',
        totalCopies: ''
      });
      setTimeout(() => navigate('/maintenance'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add book');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Add Book / Movie</h1>
        
        <div className="card">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
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
                placeholder="Enter title"
              />
            </div>

            <div className="form-group">
              <label>Author *</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Enter category"
              />
            </div>

            <div className="form-group">
              <label>Publisher *</label>
              <input
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                placeholder="Enter publisher"
              />
            </div>

            <div className="form-group">
              <label>Publication Year *</label>
              <input
                type="number"
                name="publicationYear"
                value={formData.publicationYear}
                onChange={handleChange}
                placeholder="Enter year"
              />
            </div>

            <div className="form-group">
              <label>ISBN *</label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="Enter ISBN"
              />
            </div>

            <div className="form-group">
              <label>Total Copies *</label>
              <input
                type="number"
                name="totalCopies"
                value={formData.totalCopies}
                onChange={handleChange}
                placeholder="Enter number of copies"
                min="1"
              />
            </div>

            <button type="submit" className="btn btn-primary">Add Book</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/maintenance')}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddBook;
