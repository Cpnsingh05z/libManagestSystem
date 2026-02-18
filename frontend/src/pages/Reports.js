import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../utils/api';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('books');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let response;
      switch(activeTab) {
        case 'books':
          response = await API.get('/reports/books');
          break;
        case 'members':
          response = await API.get('/reports/members');
          break;
        case 'transactions':
          response = await API.get('/reports/transactions');
          break;
        case 'fines':
          response = await API.get('/reports/fines');
          break;
        case 'overdue':
          response = await API.get('/reports/overdue');
          break;
        case 'popular':
          response = await API.get('/reports/popular-books');
          break;
        default:
          response = await API.get('/reports/books');
      }
      setData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Reports</h1>
        
        <div className="card">
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button 
              className={`btn ${activeTab === 'books' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('books')}
            >
              Books Report
            </button>
            <button 
              className={`btn ${activeTab === 'members' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('members')}
            >
              Members Report
            </button>
            <button 
              className={`btn ${activeTab === 'transactions' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('transactions')}
            >
              Transactions Report
            </button>
            <button 
              className={`btn ${activeTab === 'fines' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('fines')}
            >
              Fines Report
            </button>
            <button 
              className={`btn ${activeTab === 'overdue' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('overdue')}
            >
              Overdue Report
            </button>
            <button 
              className={`btn ${activeTab === 'popular' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('popular')}
            >
              Popular Books
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="table-container">
              {activeTab === 'books' && (
                <table>
                  <thead>
                    <tr>
                      <th>Serial No</th>
                      <th>Type</th>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Category</th>
                      <th>Total Copies</th>
                      <th>Available</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr key={item.serialNumber}>
                        <td>{item.serialNumber}</td>
                        <td>{item.type}</td>
                        <td>{item.title}</td>
                        <td>{item.author}</td>
                        <td>{item.category}</td>
                        <td>{item.totalCopies}</td>
                        <td>{item.availableCopies}</td>
                        <td>{item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'members' && (
                <table>
                  <thead>
                    <tr>
                      <th>Membership No</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Type</th>
                      <th>End Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr key={item.membershipNumber}>
                        <td>{item.membershipNumber}</td>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.phone}</td>
                        <td>{item.membershipType}</td>
                        <td>{new Date(item.endDate).toLocaleDateString()}</td>
                        <td>{item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'transactions' && (
                <table>
                  <thead>
                    <tr>
                      <th>Book Title</th>
                      <th>Member Name</th>
                      <th>Issue Date</th>
                      <th>Expected Return</th>
                      <th>Actual Return</th>
                      <th>Fine</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr key={item._id}>
                        <td>{item.bookTitle}</td>
                        <td>{item.memberName}</td>
                        <td>{new Date(item.issueDate).toLocaleDateString()}</td>
                        <td>{new Date(item.expectedReturnDate).toLocaleDateString()}</td>
                        <td>{item.actualReturnDate ? new Date(item.actualReturnDate).toLocaleDateString() : '-'}</td>
                        <td>₹{item.fine}</td>
                        <td>{item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'fines' && (
                <table>
                  <thead>
                    <tr>
                      <th>Book Title</th>
                      <th>Member Name</th>
                      <th>Return Date</th>
                      <th>Fine Amount</th>
                      <th>Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr key={item._id}>
                        <td>{item.bookTitle}</td>
                        <td>{item.memberName}</td>
                        <td>{new Date(item.actualReturnDate).toLocaleDateString()}</td>
                        <td>₹{item.fine}</td>
                        <td>{item.finePaid ? 'Yes' : 'No'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'overdue' && (
                <table>
                  <thead>
                    <tr>
                      <th>Book Title</th>
                      <th>Member Name</th>
                      <th>Phone</th>
                      <th>Expected Return</th>
                      <th>Days Overdue</th>
                      <th>Estimated Fine</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr key={item.transactionId}>
                        <td>{item.bookTitle}</td>
                        <td>{item.memberName}</td>
                        <td>{item.memberPhone}</td>
                        <td>{new Date(item.expectedReturnDate).toLocaleDateString()}</td>
                        <td style={{ color: 'red', fontWeight: 'bold' }}>{item.daysOverdue}</td>
                        <td style={{ color: 'red', fontWeight: 'bold' }}>₹{item.estimatedFine}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'popular' && (
                <table>
                  <thead>
                    <tr>
                      <th>Book Title</th>
                      <th>Author</th>
                      <th>Issue Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr key={item._id}>
                        <td>{item.bookTitle}</td>
                        <td>{item.bookAuthor}</td>
                        <td style={{ fontWeight: 'bold', color: '#4CAF50' }}>{item.issueCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Reports;
