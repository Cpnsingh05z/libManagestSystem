const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const Member = require('../models/Member');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const availableBooks = await Book.countDocuments({ availableCopies: { $gt: 0 } });
    const totalMembers = await Member.countDocuments({ status: 'active' });
    const activeTransactions = await Transaction.countDocuments({ status: 'issued' });
    const overdueTransactions = await Transaction.countDocuments({
      status: 'issued',
      expectedReturnDate: { $lt: new Date() }
    });

    // Calculate total issued books from all books
    const allBooks = await Book.find();
    const issuedBooks = allBooks.reduce((sum, book) => sum + (book.totalCopies - book.availableCopies), 0);

    const totalFineCollected = await Transaction.aggregate([
      { $match: { finePaid: true } },
      { $group: { _id: null, total: { $sum: '$fine' } } }
    ]);

    const pendingFine = await Transaction.aggregate([
      { $match: { status: 'returned', finePaid: false, fine: { $gt: 0 } } },
      { $group: { _id: null, total: { $sum: '$fine' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalBooks,
        availableBooks,
        issuedBooks,
        totalMembers,
        activeTransactions,
        overdueTransactions,
        totalFineCollected: totalFineCollected[0]?.total || 0,
        pendingFine: pendingFine[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookReport = async (req, res) => {
  try {
    const { type, status } = req.query;
    
    let query = {};
    if (type) query.type = type;
    if (status) query.status = status;

    const books = await Book.find(query).sort({ title: 1 });
    
    const report = books.map(book => ({
      serialNumber: book.serialNumber,
      type: book.type,
      title: book.title,
      author: book.author,
      category: book.category,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      issuedCopies: book.totalCopies - book.availableCopies,
      status: book.status
    }));

    res.json({ success: true, count: report.length, data: report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMemberReport = async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = {};
    if (status) query.status = status;

    const members = await Member.find(query).sort({ name: 1 });
    
    const report = await Promise.all(members.map(async (member) => {
      const activeIssues = await Transaction.countDocuments({
        memberId: member._id,
        status: 'issued'
      });

      const totalIssues = await Transaction.countDocuments({
        memberId: member._id
      });

      return {
        membershipNumber: member.membershipNumber,
        name: member.name,
        email: member.email,
        phone: member.phone,
        membershipType: member.membershipType,
        startDate: member.startDate,
        endDate: member.endDate,
        status: member.status,
        activeIssues,
        totalIssues
      };
    }));

    res.json({ success: true, count: report.length, data: report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransactionReport = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    
    let query = {};
    if (status) query.status = status;
    
    if (startDate || endDate) {
      query.issueDate = {};
      if (startDate) query.issueDate.$gte = new Date(startDate);
      if (endDate) query.issueDate.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .populate('bookId', 'title author serialNumber')
      .populate('memberId', 'name membershipNumber')
      .sort({ issueDate: -1 });

    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFineReport = async (req, res) => {
  try {
    const { paid } = req.query;
    
    let query = { fine: { $gt: 0 } };
    if (paid !== undefined) {
      query.finePaid = paid === 'true';
    }

    const transactions = await Transaction.find(query)
      .populate('bookId', 'title author')
      .populate('memberId', 'name membershipNumber')
      .sort({ actualReturnDate: -1 });

    const totalFine = transactions.reduce((sum, t) => sum + t.fine, 0);
    const paidFine = transactions.filter(t => t.finePaid).reduce((sum, t) => sum + t.fine, 0);
    const pendingFine = totalFine - paidFine;

    res.json({
      success: true,
      summary: {
        totalFine,
        paidFine,
        pendingFine,
        totalTransactions: transactions.length
      },
      data: transactions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOverdueReport = async (req, res) => {
  try {
    const today = new Date();
    
    const overdueTransactions = await Transaction.find({
      status: 'issued',
      expectedReturnDate: { $lt: today }
    })
      .populate('bookId', 'title author serialNumber')
      .populate('memberId', 'name membershipNumber phone')
      .sort({ expectedReturnDate: 1 });

    const report = overdueTransactions.map(t => {
      const daysOverdue = Math.ceil((today - new Date(t.expectedReturnDate)) / (1000 * 60 * 60 * 24));
      const estimatedFine = daysOverdue * 10;
      
      return {
        transactionId: t._id,
        bookTitle: t.bookTitle,
        bookAuthor: t.bookAuthor,
        bookSerialNumber: t.bookSerialNumber,
        memberName: t.memberName,
        membershipNumber: t.membershipNumber,
        memberPhone: t.memberId?.phone,
        issueDate: t.issueDate,
        expectedReturnDate: t.expectedReturnDate,
        daysOverdue,
        estimatedFine
      };
    });

    res.json({ success: true, count: report.length, data: report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPopularBooksReport = async (req, res) => {
  try {
    const popularBooks = await Transaction.aggregate([
      {
        $group: {
          _id: '$bookId',
          bookTitle: { $first: '$bookTitle' },
          bookAuthor: { $first: '$bookAuthor' },
          bookSerialNumber: { $first: '$bookSerialNumber' },
          issueCount: { $sum: 1 }
        }
      },
      { $sort: { issueCount: -1 } },
      { $limit: 20 }
    ]);

    res.json({ success: true, data: popularBooks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
