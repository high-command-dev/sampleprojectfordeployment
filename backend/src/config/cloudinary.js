const { v2: cloudinary } = require('cloudinary');

const connectCloudinary = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUND_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn('Cloudinary is not fully configured. Upload features will be unavailable.');
    return null;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  console.log('Cloudinary configured successfully');
  return cloudinary;
};

module.exports = {
  cloudinary,
  connectCloudinary,
};
