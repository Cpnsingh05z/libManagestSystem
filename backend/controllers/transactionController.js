const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const Member = require('../models/Member');

exports.issueBook = async (req, res) => {
  try {
    const { bookSerialNumber, membershipNumber, issueDate, returnDate, remarks } = req.body;

    if (!bookSerialNumber || !membershipNumber || !issueDate) {
      return res.status(400).json({ 
        message: 'Please make a valid selection. Book, member and issue date are required.' 
      });
    }

    const book = await Book.findOne({ serialNumber: bookSerialNumber });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'Book is not available for issue' });
    }

    const member = await Member.findOne({ membershipNumber });
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    if (member.status !== 'active') {
      return res.status(400).json({ message: 'Member membership is not active' });
    }

    const issueDateObj = new Date(issueDate);
    // Validation removed for testing overdue - allow past dates
    // const today = new Date();
    // today.setHours(0, 0, 0, 0);
    // 
    // if (issueDateObj < today) {
    //   return res.status(400).json({ message: 'Issue date cannot be earlier than today' });
    // }

    let expectedReturnDate;
    if (returnDate) {
      expectedReturnDate = new Date(returnDate);
      const maxReturnDate = new Date(issueDateObj);
      maxReturnDate.setDate(maxReturnDate.getDate() + 15);
      
      if (expectedReturnDate > maxReturnDate) {
        return res.status(400).json({ 
          message: 'Return date cannot be greater than 15 days from issue date' 
        });
      }
    } else {
      expectedReturnDate = new Date(issueDateObj);
      expectedReturnDate.setDate(expectedReturnDate.getDate() + 15);
    }

    const transaction = await Transaction.create({
      bookId: book._id,
      bookSerialNumber: book.serialNumber,
      bookTitle: book.title,
      bookAuthor: book.author,
      memberId: member._id,
      memberName: member.name,
      membershipNumber: member.membershipNumber,
      issueDate: issueDateObj,
      expectedReturnDate,
      remarks: remarks || '',
      issuedBy: req.user._id
    });

    book.availableCopies -= 1;
    if (book.availableCopies === 0) {
      book.status = 'unavailable';
    }
    await book.save();

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { bookSerialNumber, membershipNumber, actualReturnDate, remarks } = req.body;

    if (!bookSerialNumber || !membershipNumber) {
      return res.status(400).json({ 
        message: 'Please make a valid selection. Book serial number and membership number are required.' 
      });
    }

    const transaction = await Transaction.findOne({
      bookSerialNumber,
      membershipNumber,
      status: 'issued'
    }).sort({ issueDate: -1 });

    if (!transaction) {
      return res.status(404).json({ message: 'No active transaction found for this book and member' });
    }

    const returnDateObj = actualReturnDate ? new Date(actualReturnDate) : new Date();
    
    transaction.actualReturnDate = returnDateObj;
    transaction.status = 'returned';
    transaction.returnedBy = req.user._id;
    if (remarks) transaction.remarks = remarks;
    
    transaction.calculateFine();

    await transaction.save();

    const book = await Book.findOne({ serialNumber: bookSerialNumber });
    if (book) {
      book.availableCopies += 1;
      book.status = 'available';
      await book.save();
    }

    res.json({ 
      success: true, 
      data: transaction,
      requiresFinePayment: transaction.fine > 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.payFine = async (req, res) => {
  try {
    const { transactionId, finePaid, remarks } = req.body;

    if (!transactionId) {
      return res.status(400).json({ message: 'Transaction ID is required' });
    }

    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.fine > 0 && !finePaid) {
      return res.status(400).json({ 
        message: 'Please make a valid selection. Fine must be paid before completing the transaction.' 
      });
    }

    transaction.finePaid = finePaid || false;
    if (remarks) transaction.remarks = remarks;
    
    await transaction.save();

    res.json({ 
      success: true, 
      message: 'Transaction completed successfully',
      data: transaction 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('bookId', 'title author')
      .populate('memberId', 'name membershipNumber')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getActiveTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ status: 'issued' })
      .populate('bookId', 'title author')
      .populate('memberId', 'name membershipNumber')
      .sort({ issueDate: -1 });
    
    res.json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransactionsByMember = async (req, res) => {
  try {
    const { membershipNumber } = req.params;
    
    const transactions = await Transaction.find({ membershipNumber })
      .populate('bookId', 'title author')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransactionsByBook = async (req, res) => {
  try {
    const { serialNumber } = req.params;
    
    const transactions = await Transaction.find({ bookSerialNumber: serialNumber })
      .populate('memberId', 'name membershipNumber')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOverdueTransactions = async (req, res) => {
  try {
    const today = new Date();
    
    const transactions = await Transaction.find({
      status: 'issued',
      expectedReturnDate: { $lt: today }
    })
      .populate('bookId', 'title author')
      .populate('memberId', 'name membershipNumber')
      .sort({ expectedReturnDate: 1 });
    
    res.json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
