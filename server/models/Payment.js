const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    default: null
  },
  paymentType: {
    type: String,
    enum: ['course', 'subscription', 'task', 'certificate'],
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'cancelled'],
    default: 'pending'
  },
  mpesaReceipt: {
    type: String,
    default: null
  },
  checkoutRequestID: {
    type: String,
    required: true
  },
  merchantRequestID: {
    type: String,
    default: null
  },
  resultDescription: {
    type: String,
    default: null
  },
  transactionDate: {
    type: Date,
    default: null
  }
}, { timestamps: true });

paymentSchema.index({ checkoutRequestID: 1 });
paymentSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
