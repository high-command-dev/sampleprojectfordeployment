const { transporter, isEmailServiceConfigured, smtpTimeoutMs } = require('../config/smtp');

const createEmailServiceError = (message, cause) => {
  const error = new Error(message);
  error.statusCode = 503;

  if (cause) {
    error.cause = cause;
  }

  return error;
};

const withTimeout = (promise, timeoutMs, label) =>
  new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(createEmailServiceError(`${label} timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });

const sendEmail = async ({ to, subject, html, text }) => {
  if (!isEmailServiceConfigured()) {
    throw createEmailServiceError('Email service is not configured.');
  }

  try {
    await withTimeout(
      transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        text,
        html,
      }),
      smtpTimeoutMs,
      'SMTP send'
    );
  } catch (error) {
    console.warn(`Failed to send email: ${error.message}`);
    if (error.statusCode === 503) {
      throw error;
    }

    throw createEmailServiceError(`Failed to send email: ${error.message}`, error);
  }
};

module.exports = sendEmail;
