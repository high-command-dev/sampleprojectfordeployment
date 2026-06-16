const nodemailer = require('nodemailer');

const requiredSmtpVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];
const DEFAULT_SMTP_TIMEOUT_MS = 30000;

const isBlank = (value) => value === undefined || value === null || String(value).trim() === '';

const parsePositiveInt = (value, fallback) => {
  const parsed = Number(String(value).trim());

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
};

const smtpTimeoutMs = parsePositiveInt(process.env.SMTP_TIMEOUT_MS || DEFAULT_SMTP_TIMEOUT_MS, DEFAULT_SMTP_TIMEOUT_MS);

const getMissingSmtpVars = () => requiredSmtpVars.filter((key) => isBlank(process.env[key]));

const missingSmtpVars = getMissingSmtpVars();

if (missingSmtpVars.length > 0) {
  console.warn(`SMTP is not fully configured. OTP email sending is disabled. Missing: ${missingSmtpVars.join(', ')}`);
}

const withTimeout = (promise, timeoutMs, label) =>
  new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      const timeoutError = new Error(`${label} timed out after ${timeoutMs}ms`);
      timeoutError.statusCode = 503;
      timeoutError.code = 'ETIMEDOUT';
      reject(timeoutError);
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

const parseSmtpPort = () => {
  const rawPort = process.env.SMTP_PORT || 587;
  const parsedPort = Number(String(rawPort).trim());

  if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
    return null;
  }

  return parsedPort;
};

let transporter = null;
let transporterVerified = false;
let lastVerificationError = null;

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
    connectionTimeout: smtpTimeoutMs,
    greetingTimeout: smtpTimeoutMs,
    socketTimeout: smtpTimeoutMs,
    tls: {
      minVersion: 'TLSv1.2',
    },
  });
}

const isEmailServiceConfigured = () => Boolean(transporter);

const verifyTransporterSafely = async () => {
  if (!transporter) {
    transporterVerified = false;
    lastVerificationError = new Error('SMTP transporter is not initialized');
    return false;
  }

  try {
    await withTimeout(transporter.verify(), smtpTimeoutMs, 'SMTP verification');
    transporterVerified = true;
    lastVerificationError = null;
    return true;
  } catch (error) {
    transporterVerified = false;
    lastVerificationError = error;
    console.warn(`SMTP verification failed: ${error.message}`);
    return false;
  }
};

const getEmailServiceStatus = () => ({
  configured: Boolean(transporter),
  verified: transporterVerified,
  missingSmtpVars,
  timeoutMs: smtpTimeoutMs,
  lastError: lastVerificationError ? lastVerificationError.message : null,
});

module.exports = {
  transporter,
  missingSmtpVars,
  isEmailServiceConfigured,
  verifyTransporterSafely,
  getEmailServiceStatus,
  smtpTimeoutMs,
};
