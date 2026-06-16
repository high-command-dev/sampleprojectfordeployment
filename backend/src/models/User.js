const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      select: false,
    },
    otpExpiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.otp;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);