# 📚 Library Management System

Complete MERN Stack Library Management System with Role-Based Access Control, Transaction Management & Comprehensive Reporting.

## 🔑 Admin Login Credentials

**Username:** `admin`  
**Password:** `admin123`

> Default admin is auto-created on first server startup. Change credentials in `backend/.env` file.

## ✨ Features Overview

### 🔐 Authentication & Authorization
- JWT-based secure authentication
- Role-based access control (Admin & User)
- Password encryption with bcrypt
- Auto-creation of default admin on startup

### 📖 Maintenance Module (Admin Only)
- **Book Management**
  - Add new books and movies
  - Update book details
  - Delete books
  - Track total and available copies
  - Auto-generated serial numbers
  
- **Member Management**
  - Add new members
  - Update member details
  - Extend membership (6 months, 1 year, 2 years)
  - Cancel membership
  - Auto-generated membership numbers
  - Auto-calculated membership expiry dates
  
- **User Management**
  - Create new users (Admin/User roles)
  - Update user details
  - Activate/Deactivate users
  - Only admins can create admin accounts

### 🔄 Transaction Module
- **Issue Books**
  - Search and select books
  - Select member
  - Set issue and return dates
  - Maximum 15-day loan period
  - Availability validation
  - Active membership verification
  
- **Return Books**
  - Automatic fine calculation (₹10 per day for overdue)
  - Fine payment tracking
  - Book availability update
  - Transaction history
  
- **Fine Management**
  - Auto-calculated fines for overdue books
  - Fine payment status tracking
  - Mandatory fine payment before return completion

### 📊 Reports Module
- **Dashboard Statistics**
  - Total books count
  - Available vs Issued books
  - Total members
  - Active transactions
  - Overdue transactions
  - Total fine collected
  - Pending fines
  
- **Book Reports**
  - All books list
  - Available books
  - Issued books
  - Filter by type (book/movie)
  - Filter by category
  
- **Member Reports**
  - All members list
  - Active members
  - Expired memberships
  - Membership details
  
- **Transaction Reports**
  - All transactions history
  - Active transactions
  - Completed transactions
  - Filter by date range
  - Filter by member/book
  
- **Fine Reports**
  - Total fines collected
  - Pending fines
  - Paid fines
  - Fine details by transaction
  
- **Overdue Reports**
  - All overdue books
  - Overdue days calculation
  - Fine amount for each overdue
  - Member details
  
- **Popular Books Report**
  - Most issued books
  - Issue count tracking
  - Book popularity ranking

### 🎨 Modern UI/UX
- Professional Google/Microsoft inspired design
- Gradient backgrounds and smooth animations
- Responsive layout
- Role-based navigation
- Real-time status indicators
- Loading states and error handling
- Success/Error notifications

## 👥 Role-Based Access

### 🔴 Admin Access
- ✅ Full access to Maintenance Module
  - Add/Update/Delete Books
  - Add/Update/Extend/Cancel Memberships
  - Create/Update Users (including admins)
- ✅ Full access to Transaction Module
  - Issue Books
  - Return Books
  - Pay Fines
- ✅ Full access to Reports Module
  - All 7 types of reports
  - Dashboard statistics
- ✅ View all data across system

### 🔵 User Access
- ❌ No access to Maintenance Module
- ✅ Access to Transaction Module
  - Issue Books
  - Return Books
  - Pay Fines
- ✅ Access to Reports Module (Read-only)
  - View all reports
  - Dashboard statistics
- ✅ View only (cannot modify books/members/users)

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone Repository
```bash
git clone https://github.com/your-username/LibManagestSystem.git
cd LibManagestSystem
