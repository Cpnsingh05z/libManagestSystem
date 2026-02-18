const express = require('express');
const router = express.Router();
const {
  addMember,
  getAllMembers,
  getMemberByNumber,
  updateMember,
  extendMembership,
  cancelMembership
} = require('../controllers/memberController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin'), addMember);
router.get('/', protect, getAllMembers);
router.get('/:membershipNumber', protect, getMemberByNumber);
router.put('/:membershipNumber', protect, authorize('admin'), updateMember);
router.put('/:membershipNumber/extend', protect, authorize('admin'), extendMembership);
router.put('/:membershipNumber/cancel', protect, authorize('admin'), cancelMembership);

module.exports = router;
