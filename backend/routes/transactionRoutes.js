const express = require('express');
const router = express.Router();
const {
  issueBook,
  returnBook,
  payFine,
  getAllTransactions,
  getActiveTransactions,
  getTransactionsByMember,
  getTransactionsByBook,
  getOverdueTransactions
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.post('/issue', protect, issueBook);
router.post('/return', protect, returnBook);
router.post('/pay-fine', protect, payFine);
router.get('/', protect, getAllTransactions);
router.get('/active', protect, getActiveTransactions);
router.get('/overdue', protect, getOverdueTransactions);
router.get('/member/:membershipNumber', protect, getTransactionsByMember);
router.get('/book/:serialNumber', protect, getTransactionsByBook);

module.exports = router;
