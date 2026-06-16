const express = require('express');
const {
  registerUser,
  verifyRegisterOtp,
  loginUser,
  verifyLoginOtp,
  getProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-register-otp', verifyRegisterOtp);
router.post('/login', loginUser);
router.post('/verify-login-otp', verifyLoginOtp);
router.get('/profile', protect, getProfile);

module.exports = router;