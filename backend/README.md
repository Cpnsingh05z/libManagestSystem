# Library Management System - Backend

Complete MERN Stack Backend for Library Management System with all features.

## Features

### 1. Authentication & Authorization
- Admin and User roles
- JWT based authentication
- Password encryption with bcrypt
- Role-based access control

### 2. Maintenance Module (Admin Only)
- Add/Update/Delete Books
- Add/Update/Cancel Membership
- User Management

### 3. Transaction Module
- Book Issue with validations
- Book Return with fine calculation
- Fine Payment
- Overdue tracking

### 4. Reports Module
- Dashboard Statistics
- Book Reports
- Member Reports
- Transaction Reports
- Fine Reports
- Overdue Reports
- Popular Books Report

## Installation

```bash
cd backend
npm install
```

## Environment Variables

Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library_management
JWT_SECRET=your_jwt_secret_key_here
```

## Run Application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication Routes

#### Register User
```
POST /api/auth/register
Body: {
  "name": "John Doe",
  "username": "john",
  "password": "password123",
  "role": "admin" // or "user"
}
```

#### Login
```
POST /api/auth/login
Body: {
  "username": "john",
  "password": "password123"
}
Response: {
  "success": true,
  "data": {
    "id": "...",
    "name": "John Doe",
    "username": "john",
    "role": "admin",
    "token": "jwt_token_here"
  }
}
```

#### Get All Users (Admin Only)
```
GET /api/auth/users
Headers: Authorization: Bearer <token>
```

#### Update User (Admin Only)
```
PUT /api/auth/users/:id
Headers: Authorization: Bearer <token>
Body: {
  "name": "Updated Name",
  "role": "user",
  "isActive": true
}
```

### Member Routes (Maintenance Module)

#### Add Member (Admin Only)
```
POST /api/members
Headers: Authorization: Bearer <token>
Body: {
  "name": "Member Name",
  "email": "member@email.com",
  "phone": "1234567890",
  "address": "Address",
  "membershipType": "6months" // or "1year", "2years"
}
```

#### Get All Members
```
GET /api/members
Headers: Authorization: Bearer <token>
```

#### Get Member by Membership Number
```
GET /api/members/:membershipNumber
Headers: Authorization: Bearer <token>
```

#### Update Member (Admin Only)
```
PUT /api/members/:membershipNumber
Headers: Authorization: Bearer <token>
Body: {
  "name": "Updated Name",
  "email": "updated@email.com",
  "phone": "9876543210",
  "address": "New Address",
  "membershipType": "1year",
  "status": "active"
}
```

#### Extend Membership (Admin Only)
```
PUT /api/members/:membershipNumber/extend
Headers: Authorization: Bearer <token>
Body: {
  "extensionType": "6months" // or "1year", "2years"
}
```

#### Cancel Membership (Admin Only)
```
PUT /api/members/:membershipNumber/cancel
Headers: Authorization: Bearer <token>
```

### Book Routes (Maintenance Module)

#### Add Book (Admin Only)
```
POST /api/books
Headers: Authorization: Bearer <token>
Body: {
  "type": "book", // or "movie"
  "title": "Book Title",
  "author": "Author Name",
  "category": "Fiction",
  "publisher": "Publisher Name",
  "publicationYear": 2023,
  "isbn": "1234567890",
  "totalCopies": 5
}
```

#### Get All Books
```
GET /api/books
Headers: Authorization: Bearer <token>
```

#### Search Books
```
GET /api/books/search?title=book&author=author&category=fiction&type=book
Headers: Authorization: Bearer <token>
Note: At least one query parameter required
```

#### Get Available Books
```
GET /api/books/available?title=book&author=author&category=fiction
Headers: Authorization: Bearer <token>
Note: At least one query parameter required
```

#### Get Book by Serial Number
```
GET /api/books/:serialNumber
Headers: Authorization: Bearer <token>
```

#### Update Book (Admin Only)
```
PUT /api/books/:serialNumber
Headers: Authorization: Bearer <token>
Body: {
  "type": "book",
  "title": "Updated Title",
  "author": "Author Name",
  "category": "Fiction",
  "publisher": "Publisher",
  "publicationYear": 2023,
  "isbn": "1234567890",
  "totalCopies": 10
}
```

#### Delete Book (Admin Only)
```
DELETE /api/books/:serialNumber
Headers: Authorization: Bearer <token>
```

### Transaction Routes

#### Issue Book
```
POST /api/transactions/issue
Headers: Authorization: Bearer <token>
Body: {
  "bookSerialNumber": "BK1234567890",
  "membershipNumber": "MEM1234567890",
  "issueDate": "2024-01-15",
  "returnDate": "2024-01-30", // Optional, defaults to 15 days
  "remarks": "Optional remarks"
}
Validations:
- Issue date cannot be earlier than today
- Return date cannot be more than 15 days from issue date
- Book must be available
- Member must be active
```

#### Return Book
```
POST /api/transactions/return
Headers: Authorization: Bearer <token>
Body: {
  "bookSerialNumber": "BK1234567890",
  "membershipNumber": "MEM1234567890",
  "actualReturnDate": "2024-02-01", // Optional, defaults to today
  "remarks": "Optional remarks"
}
Response includes fine calculation (Rs. 10 per day overdue)
```

#### Pay Fine
```
POST /api/transactions/pay-fine
Headers: Authorization: Bearer <token>
Body: {
  "transactionId": "transaction_id",
  "finePaid": true,
  "remarks": "Optional remarks"
}
Validation: If fine > 0, finePaid must be true
```

#### Get All Transactions
```
GET /api/transactions
Headers: Authorization: Bearer <token>
```

#### Get Active Transactions
```
GET /api/transactions/active
Headers: Authorization: Bearer <token>
```

#### Get Overdue Transactions
```
GET /api/transactions/overdue
Headers: Authorization: Bearer <token>
```

#### Get Transactions by Member
```
GET /api/transactions/member/:membershipNumber
Headers: Authorization: Bearer <token>
```

#### Get Transactions by Book
```
GET /api/transactions/book/:serialNumber
Headers: Authorization: Bearer <token>
```

### Report Routes

#### Dashboard Statistics
```
GET /api/reports/dashboard
Headers: Authorization: Bearer <token>
Response: {
  "totalBooks": 100,
  "availableBooks": 75,
  "issuedBooks": 25,
  "totalMembers": 50,
  "activeTransactions": 25,
  "overdueTransactions": 5,
  "totalFineCollected": 500,
  "pendingFine": 200
}
```

#### Book Report
```
GET /api/reports/books?type=book&status=available
Headers: Authorization: Bearer <token>
```

#### Member Report
```
GET /api/reports/members?status=active
Headers: Authorization: Bearer <token>
```

#### Transaction Report
```
GET /api/reports/transactions?status=issued&startDate=2024-01-01&endDate=2024-12-31
Headers: Authorization: Bearer <token>
```

#### Fine Report
```
GET /api/reports/fines?paid=true
Headers: Authorization: Bearer <token>
```

#### Overdue Report
```
GET /api/reports/overdue
Headers: Authorization: Bearer <token>
```

#### Popular Books Report
```
GET /api/reports/popular-books
Headers: Authorization: Bearer <token>
```

## Validations Implemented

### Book Issue
- Book name required
- Author name auto-populated and non-editable
- Issue date cannot be earlier than today
- Return date auto-populated (15 days ahead)
- Return date cannot be more than 15 days from issue date
- Remarks optional

### Book Return
- Book name required
- Author name auto-populated and non-editable
- Serial number mandatory
- Issue date auto-populated and non-editable
- Return date auto-populated (can be edited)
- Fine calculated automatically (Rs. 10/day)

### Fine Payment
- All fields auto-populated except finePaid and remarks
- If fine > 0, finePaid checkbox must be selected
- Book not returned until fine paid

### Add Membership
- All fields mandatory
- Membership type: 6months (default), 1year, or 2years
- Auto-generates membership number

### Update Membership
- Membership number mandatory
- Can extend or cancel membership
- Default extension: 6 months

### Add/Update Book
- Type selection: book (default) or movie
- All fields mandatory
- Error message if details missing

### User Management
- Type selection: new (default) or existing
- Name mandatory

## Database Models

### User
- name, username, password (hashed)
- role: admin/user
- isActive status

### Member
- membershipNumber (auto-generated)
- name, email, phone, address
- membershipType: 6months/1year/2years
- startDate, endDate (auto-calculated)
- status: active/expired/cancelled

### Book
- serialNumber (auto-generated)
- type: book/movie
- title, author, category, publisher
- publicationYear, isbn
- totalCopies, availableCopies
- status: available/unavailable

### Transaction
- Book and Member references
- issueDate, expectedReturnDate, actualReturnDate
- status: issued/returned
- fine (auto-calculated), finePaid
- remarks

## Access Control

### Admin Access
- All Maintenance operations (Add/Update Books, Members, Users)
- All Reports
- All Transactions

### User Access
- Reports (Read only)
- Transactions (Issue/Return books)
- No Maintenance access

## Fine Calculation
- Rs. 10 per day for overdue books
- Calculated automatically on return
- Must be paid before completing return transaction

## Auto-generated Fields
- Membership Number: MEM + timestamp
- Book Serial Number: BK + timestamp
- Return Date: Issue date + 15 days
- Membership End Date: Based on membership type

## Error Handling
- All validations return appropriate error messages
- Form submission blocked if mandatory fields missing
- Clear error messages displayed on same page

## Technologies Used
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled for frontend integration

## Notes
- Password hidden during login (frontend implementation)
- Radio buttons: single selection
- Checkboxes: checked = yes, unchecked = no
- All date validations implemented
- Fine payment mandatory for overdue returns
