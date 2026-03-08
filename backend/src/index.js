import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import paintingsRouter from './routes/paintings.js';
import ordersRouter from './routes/orders.js';
import webhookRouter from './routes/webhook.js';
import adminRouter from './routes/admin.js';
import collectionsRouter from './routes/collections.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestIdMiddleware } from './middleware/requestId.js';
import { logInfo } from './services/logger.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Security Headers
app.use(helmet());

// Request ID for tracing
app.use(requestIdMiddleware);

// HTTP Logging
app.use(morgan(':id :method :url :status :response-time ms'));

// Stripe webhook needs raw body BEFORE json parser
app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRouter);

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://dahliabaasher.com',
  'https://www.dahliabaasher.com',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true);
      } else {
        logInfo('CORS blocked request', { origin });
        cb(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Body Parsing (with size limits)
app.use(express.json({ limit: '10kb' }));

// API Routes
app.use('/api/admin', adminRouter);
app.use('/api/paintings', paintingsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/collections', collectionsRouter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
    method: req.method,
  });
});

// Central Error Handler
app.use(errorHandler);

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.info('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.info('Server closed');
    process.exit(0);
  });
});

const server = app.listen(PORT, () => {
  console.info(`🎨 Dahlia Baasher API running on port ${PORT}`);
});

export default app;
