const axios = require('axios');

const getAccessToken = async () => {
  try {
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString('base64');

    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: { Authorization: `Basic ${auth}` }
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('M-Pesa Auth Error:', error.response?.data || error.message);
    throw new Error('Failed to get M-Pesa access token');
  }
};

module.exports = { getAccessToken };
