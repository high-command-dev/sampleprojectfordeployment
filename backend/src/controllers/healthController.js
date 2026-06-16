const { getEmailServiceStatus } = require('../config/smtp');

const getHealth = (req, res) => {
  const emailServiceStatus = getEmailServiceStatus();

  res.status(200).json({
    success: true,
    message: 'Backend is running',
    environment: process.env.NODE_ENV || 'development',
    emailService: emailServiceStatus.verified ? 'configured' : 'not_configured',
    emailServiceStatus,
  });
};

module.exports = {
  getHealth,
};
