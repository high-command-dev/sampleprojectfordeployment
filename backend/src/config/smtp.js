const nodemailer = require('nodemailer');

const requiredSmtpVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];

const isBlank = (value) => value === undefined || value === null || String(value).trim() === '';

const getMissingSmtpVars = () => requiredSmtpVars.filter((key) => isBlank(process.env[key]));

const missingSmtpVars = getMissingSmtpVars();

if (missingSmtpVars.length > 0) {
  console.warn(`SMTP is not fully configured. OTP email sending is disabled. Missing: ${missingSmtpVars.join(', ')}`);
}

const parseSmtpPort = () => {
  const rawPort = process.env.SMTP_PORT || 587;
  const parsedPort = Number(String(rawPort).trim());

  if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
    return null;
  }

  return parsedPort;
};

let transporter = null;

const parsedPort = parseSmtpPort();

if (missingSmtpVars.length === 0 && parsedPort) {
  const port = parsedPort;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const isEmailServiceConfigured = () => Boolean(transporter);

const verifyTransporterSafely = async () => {
  if (!transporter) {
    return false;
  }

  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.warn(`SMTP verification failed: ${error.message}`);
    return false;
  }
};

module.exports = {
  transporter,
  missingSmtpVars,
  isEmailServiceConfigured,
  verifyTransporterSafely,
};
