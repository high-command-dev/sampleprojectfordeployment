const getTestConnection = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Frontend and backend are connected',
    data: {
      backend: 'Express API',
      status: 'working',
    },
  });
};

module.exports = {
  getTestConnection,
};
