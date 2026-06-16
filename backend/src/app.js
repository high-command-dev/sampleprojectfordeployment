const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/healthRoutes');
const testRoutes = require('./routes/testRoutes');
const authRoutes = require('./routes/authRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL
  })
);

app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);

app.use(notFound);

app.use(errorHandler);

module.exports = app;
