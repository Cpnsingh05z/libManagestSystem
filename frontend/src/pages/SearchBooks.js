import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../utils/api';

const SearchBooks = () => {
  const [searchParams, setSearchParams] = useState({
    title: '',
    author: '',
    category: ''
  });
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setBooks([]);

    if (!searchParams.title && !searchParams.author && !searchParams.category) {
      setError('Please make a valid selection. At least one search criteria is required.');
      return;
    }

    try {
      const params = new URLSearchParams();
      if (searchParams.title) params.append('title', searchParams.title);
      if (searchParams.author) params.append('author', searchParams.author);
      if (searchParams.category) params.append('category', searchParams.category);

      const response = await API.get(`/books/available?${params.toString()}`);
      setBooks(response.data.data);
      
      if (response.data.data.length === 0) {
        setError('No available books found matching your criteria');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search books');
    }
  };

  const handleIssue = () => {
    if (!selectedBook) {
      setError('Please select a book to issue');
      return;
    }
    navigate('/transactions/issue-book', { state: { book: selectedBook } });
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Search Available Books</h1>
        
        <div className="card">
          <form onSubmit={handleSearch}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={searchParams.title}
                onChange={handleChange}
                placeholder="Enter book title"
              />
            </div>

            <div className="form-group">
              <label>Author</label>
              <input
                type="text"
                name="author"
                value={searchParams.author}
                onChange={handleChange}
                placeholder="Enter author name"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={searchParams.category}
                onChange={handleChange}
                placeholder="Enter category"
              />
            </div>

            <button type="submit" className="btn btn-primary">Search</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/transactions')}>
              Back
            </button>
          </form>
        </div>

        {error && <div className="error-message">{error}</div>}

        {books.length > 0 && (
          <div className="card">
            <h3>Search Results</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>Type</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Available Copies</th>
                    <th>Select</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book._id}>
                      <td>{book.serialNumber}</td>
                      <td>{book.type}</td>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.category}</td>
                      <td>{book.availableCopies}</td>
                      <td>
                        <input
                          type="radio"
                          name="selectedBook"
                          checked={selectedBook?._id === book._id}
                          onChange={() => setSelectedBook(book)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <button 
              className="btn btn-primary" 
              onClick={handleIssue}
              style={{ marginTop: '20px' }}
            >
              Issue Selected Book
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBooks;
