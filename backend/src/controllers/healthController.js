const { isEmailServiceConfigured } = require('../config/smtp');

const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running',
    environment: process.env.NODE_ENV || 'development',
    emailService: isEmailServiceConfigured() ? 'configured' : 'not_configured',
  });
};

module.exports = {
  getHealth,
};
