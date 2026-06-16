const { transporter, isEmailServiceConfigured } = require('../config/smtp');

const createEmailServiceError = (message, cause) => {
  const error = new Error(message);
  error.statusCode = 503;

  if (cause) {
    error.cause = cause;
  }

  return error;
};

const sendEmail = async ({ to, subject, html, text }) => {
  if (!isEmailServiceConfigured()) {
    throw createEmailServiceError('Email service is not configured');
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.warn(`Failed to send email: ${error.message}`);
    throw createEmailServiceError('Email service is not configured', error);
  }
};

module.exports = sendEmail;