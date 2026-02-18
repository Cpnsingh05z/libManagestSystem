const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getBookReport,
  getMemberReport,
  getTransactionReport,
  getFineReport,
  getOverdueReport,
  getPopularBooksReport
} = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.get('/dashboard', protect, getDashboardStats);
router.get('/books', protect, getBookReport);
router.get('/members', protect, getMemberReport);
router.get('/transactions', protect, getTransactionReport);
router.get('/fines', protect, getFineReport);
router.get('/overdue', protect, getOverdueReport);
router.get('/popular-books', protect, getPopularBooksReport);

module.exports = router;
