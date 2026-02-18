import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Maintenance from './pages/Maintenance';
import AddBook from './pages/AddBook';
import UpdateBook from './pages/UpdateBook';
import AddMembership from './pages/AddMembership';
import UpdateMembership from './pages/UpdateMembership';
import UserManagement from './pages/UserManagement';
import Transactions from './pages/Transactions';
import SearchBooks from './pages/SearchBooks';
import IssueBook from './pages/IssueBook';
import ReturnBook from './pages/ReturnBook';
import PayFine from './pages/PayFine';
import ActiveTransactions from './pages/ActiveTransactions';
import Reports from './pages/Reports';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

          <Route path="/maintenance" element={
            <PrivateRoute adminOnly={true}>
              <Maintenance />
            </PrivateRoute>
          } />

          <Route path="/maintenance/add-book" element={
            <PrivateRoute adminOnly={true}>
              <AddBook />
            </PrivateRoute>
          } />

          <Route path="/maintenance/update-book" element={
            <PrivateRoute adminOnly={true}>
              <UpdateBook />
            </PrivateRoute>
          } />

          <Route path="/maintenance/add-membership" element={
            <PrivateRoute adminOnly={true}>
              <AddMembership />
            </PrivateRoute>
          } />

          <Route path="/maintenance/update-membership" element={
            <PrivateRoute adminOnly={true}>
              <UpdateMembership />
            </PrivateRoute>
          } />

          <Route path="/maintenance/user-management" element={
            <PrivateRoute adminOnly={true}>
              <UserManagement />
            </PrivateRoute>
          } />

          <Route path="/transactions" element={
            <PrivateRoute>
              <Transactions />
            </PrivateRoute>
          } />

          <Route path="/transactions/search-books" element={
            <PrivateRoute>
              <SearchBooks />
            </PrivateRoute>
          } />

          <Route path="/transactions/issue-book" element={
            <PrivateRoute>
              <IssueBook />
            </PrivateRoute>
          } />

          <Route path="/transactions/return-book" element={
            <PrivateRoute>
              <ReturnBook />
            </PrivateRoute>
          } />

          <Route path="/transactions/pay-fine" element={
            <PrivateRoute>
              <PayFine />
            </PrivateRoute>
          } />

          <Route path="/transactions/active" element={
            <PrivateRoute>
              <ActiveTransactions />
            </PrivateRoute>
          } />

          <Route path="/reports" element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          } />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
