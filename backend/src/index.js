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
import uploadRouter from './routes/upload.js';
import siteSettingsRouter from './routes/site-settings.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestIdMiddleware } from './middleware/requestId.js';
import { logInfo, logError } from './services/logger.js';

const app = express();
app.use(requestIdMiddleware);
const PORT = process.env.PORT || 3001;

// Railway/Render/Vercel run behind a reverse proxy and set X-Forwarded-* headers.
// Trust first proxy so rate-limit can identify users correctly.
app.set('trust proxy', 1);

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
    allowedHeaders: ['Content-Type', 'x-admin-key'],
  })
);

// Body Parsing (with size limits)
app.use(express.json({ limit: '10kb' }));

// Allow larger body for upload route (handled by upload.js directly)
app.use('/api/admin/upload', express.raw({ type: 'multipart/form-data', limit: '20mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    adminKeySet: !!process.env.ADMIN_KEY,
  });
});

// Root route for platform health checks
app.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    service: 'dahlia-baasher-api',
    health: '/api/health',
  });
});

// API Routes
app.use('/api/admin', adminRouter);
app.use('/api/paintings', paintingsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/collections', collectionsRouter);
app.use('/api/commissions', commissionsRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/admin/upload', uploadRouter);
app.use('/api/site-settings', siteSettingsRouter);

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

// Start server
const server = app.listen(PORT, () => {
  logInfo(`🎨 Dahlia Baasher API running on port ${PORT}`);
  logInfo(`Admin key configured: ${!!process.env.ADMIN_KEY}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logInfo('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    logInfo('Server closed');
    process.exit(0);
  });
});

export default app;
