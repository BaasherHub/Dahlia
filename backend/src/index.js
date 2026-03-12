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
import commissionsRouter from './routes/commissions.js';
import newsletterRouter from './routes/newsletter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestIdMiddleware } from './middleware/requestId.js';
import { logInfo, logError } from './services/logger.js';

const app = express();
app.use(requestIdMiddleware);
const PORT = process.env.PORT || 3001;

// Security Headers
app.use(helmet());

// HTTP Logging
app.use(morgan(':method :url :status :response-time ms'));

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
        cb(null, false);
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "x-admin-key"],
  })
);

// Body Parsing (with size limits)
app.use(express.json({ limit: '10kb' }));

// ── HEALTH CHECK ── (This was missing!)
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    adminKeySet: !!process.env.ADMIN_KEY,
  });
});

// API Routes
app.use('/api/admin', adminRouter);
app.use('/api/paintings', paintingsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/collections', collectionsRouter);
app.use('/api/commissions', commissionsRouter);
app.use('/api/newsletter', newsletterRouter);

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
const server = app.listen(PORT, () => {
  logInfo(`🎨 Dahlia Baasher API running on port ${PORT}`);
  logInfo(`Admin key configured: ${!!process.env.ADMIN_KEY}`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  logInfo('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    logInfo('Server closed');
    process.exit(0);
  });
});

export default app;
