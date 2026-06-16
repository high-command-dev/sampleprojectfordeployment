const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/healthRoutes');
const testRoutes = require('./routes/testRoutes');
const authRoutes = require('./routes/authRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

const allowedOrigins = new Set([
  process.env.FRONTEND_URL || 'http://localhost:5173',
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:5174',
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);

app.use(notFound);

app.use(errorHandler);

module.exports = app;
