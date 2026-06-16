const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const generateOtp = require('../utils/generateOtp');
const sendEmail = require('../utils/sendEmail');
const { isEmailServiceConfigured } = require('../config/smtp');

const getOtpExpiryDate = () => {
  const minutes = Number(process.env.OTP_EXPIRES_IN_MINUTES || 10);
  return new Date(Date.now() + minutes * 60 * 1000);
};

const safeUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const sendOtpMessage = async (email, otp, purpose) => {
  const subject = purpose === 'register' ? 'Verify your account' : 'Login verification code';
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h2>${subject}</h2>
      <p>Your one-time password is:</p>
      <p style="font-size: 28px; font-weight: 700; letter-spacing: 6px;">${otp}</p>
      <p>This code expires in ${process.env.OTP_EXPIRES_IN_MINUTES || 10} minutes.</p>
      <p>If you did not request this, you can ignore this email.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject,
    text: `Your OTP is ${otp}. It expires in ${process.env.OTP_EXPIRES_IN_MINUTES || 10} minutes.`,
    html,
  });
};

const emailServiceUnavailableResponse = (res, message = 'Email service is not configured. OTP cannot be sent.') =>
  res.status(503).json({
    success: false,
    message,
  });

const isEmailServiceUnavailableError = (error) =>
  error?.statusCode === 503 || error?.message?.includes('Email service');

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    if (!isEmailServiceConfigured()) {
      return emailServiceUnavailableResponse(res, 'Email service is not ready yet. Please try again later.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      isEmailVerified: false,
      otp: hashedOtp,
      otpExpiresAt: getOtpExpiryDate(),
    });

    try {
      await sendOtpMessage(normalizedEmail, otp, 'register');
    } catch (emailError) {
      await User.findByIdAndDelete(user._id);

      if (isEmailServiceUnavailableError(emailError)) {
        return emailServiceUnavailableResponse(res, emailError.message || 'Unable to send OTP email.');
      }

      return emailServiceUnavailableResponse(res, 'Unable to send OTP email. Please try again later.');
    }

    return res.status(201).json({
      success: true,
      message: 'OTP sent to your email address',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Registration failed' });
  }
};

const verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+otp +password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.otp || !user.otpExpiresAt) {
      return res.status(400).json({ success: false, message: 'OTP not generated for this user' });
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    const isOtpValid = await bcrypt.compare(String(otp).trim(), user.otp);

    if (!isOtpValid) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      token,
      user: safeUserResponse(user),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'OTP verification failed' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password +otp');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ success: false, message: 'Please verify your email first' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    if (!isEmailServiceConfigured()) {
      return emailServiceUnavailableResponse(res, 'Email service is not ready yet. Please try again later.');
    }

    const otp = generateOtp();
    user.otp = await bcrypt.hash(otp, 10);
    user.otpExpiresAt = getOtpExpiryDate();
    await user.save();

    try {
      await sendOtpMessage(user.email, otp, 'login');
    } catch (emailError) {
      user.otp = undefined;
      user.otpExpiresAt = undefined;
      await user.save();

      if (isEmailServiceUnavailableError(emailError)) {
        return emailServiceUnavailableResponse(res, emailError.message || 'Unable to send OTP email.');
      }

      return emailServiceUnavailableResponse(res, 'Unable to send OTP email. Please try again later.');
    }

    return res.status(200).json({
      success: true,
      message: 'Login OTP sent to your email address',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Login failed' });
  }
};

const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+otp +password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.otp || !user.otpExpiresAt) {
      return res.status(400).json({ success: false, message: 'OTP not generated for this user' });
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    const isOtpValid = await bcrypt.compare(String(otp).trim(), user.otp);

    if (!isOtpValid) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login verified successfully',
      token,
      user: safeUserResponse(user),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'OTP verification failed' });
  }
};

const getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: safeUserResponse(req.user),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch profile' });
  }
};

module.exports = {
  registerUser,
  verifyRegisterOtp,
  loginUser,
  verifyLoginOtp,
  getProfile,
};
