const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();
const connectDB = require('../config/db');

const seedUser = async () => {
  try {
    await connectDB();

    await User.deleteOne({ email: 'test@skillsprint.co.ke' });

    const user = await User.create({
      name: 'Test User',
      email: 'test@skillsprint.co.ke',
      password: 'password123',
      phone: '0712345678',
      role: 'student'
    });

    console.log('✅ Test user created:');
    console.log('   Email   :', user.email);
    console.log('   Password: password123');
    console.log('   Phone   :', user.phone);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding user:', error);
    process.exit(1);
  }
};

seedUser();
