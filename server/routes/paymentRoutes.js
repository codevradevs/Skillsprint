const express = require('express');
const router = express.Router();
const {
  stkPush,
  mpesaCallback,
  checkPaymentStatus,
  getPaymentHistory,
  testEnroll,
  testSubscribe
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/stk', protect, stkPush);
router.post('/callback', mpesaCallback);
router.get('/status/:checkoutRequestID', protect, checkPaymentStatus);
router.get('/history', protect, getPaymentHistory);
router.post('/test-enroll', protect, testEnroll);
router.post('/test-subscribe', protect, testSubscribe);

module.exports = router;
