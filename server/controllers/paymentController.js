const axios = require('axios');
const moment = require('moment');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { getAccessToken } = require('../config/mpesa');

const formatPhoneNumber = (phone) => {
  phone = phone.replace(/\s/g, '');
  
  if (phone.startsWith('0')) {
    return '254' + phone.substring(1);
  }
  if (phone.startsWith('+')) {
    return phone.substring(1);
  }
  if (phone.startsWith('7') || phone.startsWith('1')) {
    return '254' + phone;
  }
  return phone;
};

const testEnroll = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    if (!courseId) return res.status(400).json({ message: 'courseId is required' });

    const existing = await Enrollment.findOne({ user: userId, course: courseId });
    if (!existing) {
      await Enrollment.create({ user: userId, course: courseId, progress: 0, accessType: 'purchased' });
      await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });
      await User.findByIdAndUpdate(userId, {
        $push: { enrolledCourses: { course: courseId, progress: 0, enrolledAt: new Date() } }
      });
    }

    res.json({ success: true, message: 'Test enrollment successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const testSubscribe = async (req, res) => {
  try {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    await User.findByIdAndUpdate(req.user._id, {
      subscriptionStatus: 'active',
      subscriptionExpiry: expiryDate
    });
    res.json({
      success: true,
      message: 'Test subscription activated',
      expiresAt: expiryDate
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const stkPush = async (req, res) => {
  try {
    const { phone, amount, courseId, paymentType = 'course' } = req.body;
    const userId = req.user._id;

    if (!phone || !amount) {
      return res.status(400).json({ message: 'Phone and amount are required' });
    }

    const formattedPhone = formatPhoneNumber(phone);
    
    if (!/^2547\d{8}$/.test(formattedPhone)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    const token = await getAccessToken();
    const timestamp = moment().format('YYYYMMDDHHmmss');
    
    const password = Buffer.from(
      process.env.MPESA_SHORTCODE + process.env.MPESA_PASSKEY + timestamp
    ).toString('base64');

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: 'SkillSprint',
        TransactionDesc: paymentType === 'subscription' ? 'Subscription Payment' : 'Course Purchase'
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    await Payment.create({
      user: userId,
      course: courseId || null,
      paymentType,
      phone: formattedPhone,
      amount,
      checkoutRequestID: response.data.CheckoutRequestID,
      merchantRequestID: response.data.MerchantRequestID,
      status: 'pending'
    });

    res.json({
      success: true,
      message: 'STK push sent successfully',
      data: {
        checkoutRequestID: response.data.CheckoutRequestID,
        merchantRequestID: response.data.MerchantRequestID,
        customerMessage: response.data.CustomerMessage
      }
    });

  } catch (error) {
    console.error('STK Push Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
      error: error.response?.data?.errorMessage || error.message
    });
  }
};

const mpesaCallback = async (req, res) => {
  try {
    const { Body } = req.body;
    
    if (!Body || !Body.stkCallback) {
      return res.sendStatus(400);
    }

    const { stkCallback } = Body;
    const resultCode = stkCallback.ResultCode;
    const checkoutRequestID = stkCallback.CheckoutRequestID;
    const resultDesc = stkCallback.ResultDesc;

    console.log('M-Pesa Callback:', { resultCode, checkoutRequestID, resultDesc });

    const payment = await Payment.findOne({ checkoutRequestID });
    
    if (!payment) {
      console.error('Payment not found for checkoutRequestID:', checkoutRequestID);
      return res.sendStatus(404);
    }

    if (resultCode === 0) {
      const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];
      const mpesaReceipt = callbackMetadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
      const transactionDate = callbackMetadata.find(item => item.Name === 'TransactionDate')?.Value;
      const phone = callbackMetadata.find(item => item.Name === 'PhoneNumber')?.Value;
      const amount = callbackMetadata.find(item => item.Name === 'Amount')?.Value;

      payment.status = 'success';
      payment.mpesaReceipt = mpesaReceipt;
      payment.transactionDate = transactionDate ? moment(transactionDate, 'YYYYMMDDHHmmss').toDate() : new Date();
      payment.resultDescription = resultDesc;
      await payment.save();

      if (payment.paymentType === 'course' && payment.course) {
        const existingEnrollment = await Enrollment.findOne({
          user: payment.user,
          course: payment.course
        });

        if (!existingEnrollment) {
          await Enrollment.create({
            user: payment.user,
            course: payment.course,
            progress: 0,
            accessType: 'purchased'
          });

          await Course.findByIdAndUpdate(payment.course, {
            $inc: { enrolledCount: 1 }
          });

          await User.findByIdAndUpdate(payment.user, {
            $push: {
              enrolledCourses: {
                course: payment.course,
                progress: 0,
                enrolledAt: new Date()
              }
            }
          });
        }
      } else if (payment.paymentType === 'subscription') {
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);

        await User.findByIdAndUpdate(payment.user, {
          subscriptionStatus: 'active',
          subscriptionExpiry: expiryDate
        });

        // Enroll in all published courses as subscription access
        const allCourses = await Course.find({ isPublished: true }).select('_id');
        for (const course of allCourses) {
          const exists = await Enrollment.findOne({ user: payment.user, course: course._id });
          if (!exists) {
            await Enrollment.create({
              user: payment.user,
              course: course._id,
              progress: 0,
              accessType: 'subscription'
            });
            await Course.findByIdAndUpdate(course._id, { $inc: { enrolledCount: 1 } });
            await User.findByIdAndUpdate(payment.user, {
              $push: { enrolledCourses: { course: course._id, progress: 0, enrolledAt: new Date() } }
            });
          } else if (exists.accessType === 'subscription') {
            // Already enrolled via subscription — keep it, access controlled by sub status
          }
        }
      }

      console.log('Payment successful, user enrolled/subscribed');
    } else {
      payment.status = 'failed';
      payment.resultDescription = resultDesc;
      await payment.save();
      console.log('Payment failed:', resultDesc);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Callback Error:', error);
    res.sendStatus(500);
  }
};

const checkPaymentStatus = async (req, res) => {
  try {
    const { checkoutRequestID } = req.params;
    
    const payment = await Payment.findOne({ checkoutRequestID });
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({
      success: true,
      data: {
        status: payment.status,
        mpesaReceipt: payment.mpesaReceipt,
        amount: payment.amount,
        createdAt: payment.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('course', 'title slug image')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  stkPush,
  mpesaCallback,
  checkPaymentStatus,
  getPaymentHistory,
  testEnroll,
  testSubscribe
};
