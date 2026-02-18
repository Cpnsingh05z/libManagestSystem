const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  membershipNumber: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  membershipType: {
    type: String,
    enum: ['6months', '1year', '2years'],
    default: '6months',
    required: true
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

memberSchema.pre('save', function(next) {
  if (!this.endDate || this.isNew || this.isModified('membershipType') || this.isModified('startDate')) {
    const start = new Date(this.startDate);
    let endDate = new Date(start);
    
    switch(this.membershipType) {
      case '6months':
        endDate.setMonth(endDate.getMonth() + 6);
        break;
      case '1year':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      case '2years':
        endDate.setFullYear(endDate.getFullYear() + 2);
        break;
    }
    this.endDate = endDate;
  }
  next();
});

module.exports = mongoose.model('Member', memberSchema);
