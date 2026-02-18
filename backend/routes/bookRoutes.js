const express = require('express');
const router = express.Router();
const {
  addBook,
  getAllBooks,
  getBookBySerial,
  searchBooks,
  getAvailableBooks,
  updateBook,
  deleteBook
} = require('../controllers/bookController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin'), addBook);
router.get('/', protect, getAllBooks);
router.get('/search', protect, searchBooks);
router.get('/available', protect, getAvailableBooks);
router.get('/:serialNumber', protect, getBookBySerial);
router.put('/:serialNumber', protect, authorize('admin'), updateBook);
router.delete('/:serialNumber', protect, authorize('admin'), deleteBook);

module.exports = router;
