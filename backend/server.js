require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');
const { connectCloudinary } = require('./src/config/cloudinary');
const { verifyTransporterSafely, getEmailServiceStatus } = require('./src/config/smtp');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    connectCloudinary();
    await verifyTransporterSafely();

    const emailServiceStatus = getEmailServiceStatus();
    if (!emailServiceStatus.verified) {
      console.warn(
        `SMTP is not ready at startup. Missing: ${
          emailServiceStatus.missingSmtpVars.join(', ') || 'none'
        }. Last error: ${emailServiceStatus.lastError || 'none'}`
      );
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
