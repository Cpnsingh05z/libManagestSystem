const Book = require('../models/Book');

exports.addBook = async (req, res) => {
  try {
    const { type, title, author, category, publisher, publicationYear, isbn, totalCopies } = req.body;

    if (!type || !title || !author || !category || !publisher || !publicationYear || !isbn || !totalCopies) {
      return res.status(400).json({ message: 'All fields are mandatory. Please enter all details.' });
    }

    const serialNumber = 'BK' + Date.now();
    
    const book = await Book.create({
      serialNumber,
      type: type || 'book',
      title,
      author,
      category,
      publisher,
      publicationYear,
      isbn,
      totalCopies,
      availableCopies: totalCopies
    });

    res.status(201).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookBySerial = async (req, res) => {
  try {
    const book = await Book.findOne({ serialNumber: req.params.serialNumber });
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchBooks = async (req, res) => {
  try {
    const { title, author, category, type } = req.query;

    if (!title && !author && !category && !type) {
      return res.status(400).json({ 
        message: 'Please make a valid selection. At least one search criteria is required.' 
      });
    }

    let query = {};
    
    if (title) query.title = { $regex: title, $options: 'i' };
    if (author) query.author = { $regex: author, $options: 'i' };
    if (category) query.category = { $regex: category, $options: 'i' };
    if (type) query.type = type;

    const books = await Book.find(query);
    
    res.json({ success: true, count: books.length, data: books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAvailableBooks = async (req, res) => {
  try {
    const { title, author, category } = req.query;

    if (!title && !author && !category) {
      return res.status(400).json({ 
        message: 'Please make a valid selection. At least one search criteria is required.' 
      });
    }

    let query = { availableCopies: { $gt: 0 } };
    
    if (title) query.title = { $regex: title, $options: 'i' };
    if (author) query.author = { $regex: author, $options: 'i' };
    if (category) query.category = { $regex: category, $options: 'i' };

    const books = await Book.find(query);
    
    res.json({ success: true, count: books.length, data: books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { serialNumber } = req.params;
    const { type, title, author, category, publisher, publicationYear, isbn, totalCopies } = req.body;

    if (!type || !title || !author || !category || !publisher || !publicationYear || !isbn || !totalCopies) {
      return res.status(400).json({ message: 'All fields are mandatory. Please enter all details.' });
    }

    const book = await Book.findOne({ serialNumber });
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const issuedCopies = book.totalCopies - book.availableCopies;
    
    book.type = type;
    book.title = title;
    book.author = author;
    book.category = category;
    book.publisher = publisher;
    book.publicationYear = publicationYear;
    book.isbn = isbn;
    book.totalCopies = totalCopies;
    book.availableCopies = totalCopies - issuedCopies;

    await book.save();

    res.json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ serialNumber: req.params.serialNumber });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
