import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { execSync } from 'child_process';

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
import prisma from './lib/prisma.js';

// ── Run migrations on startup ─────────────────────────────────────────────────
async function runMigrations() {
  try {
    await prisma.$executeRawUnsafe(`
      UPDATE "_prisma_migrations"
      SET "finished_at" = NOW(),
          "applied_steps_count" = 1,
          "logs" = NULL
      WHERE "finished_at" IS NULL
      AND "rolled_back_at" IS NULL;
    `);
    logInfo('Checked and resolved any failed migrations');
  } catch (err) {
    logInfo('Migration fix skipped (table may not exist yet)', { error: err.message });
  }

  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    logInfo('Prisma migrations applied');
  } catch (err) {
    logError({ message: 'Migration failed', error: err.message });
    process.exit(1);
  }
}

await runMigrations();

// ── App setup ─────────────────────────────────────────────────────────────────
const app = express();
app.use(requestIdMiddleware);
const PORT = process.env.PORT || 3001;

app.set('trust proxy', 1);
app.use(helmet());
app.use(morgan(':method :url :status :response-time ms'));

app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRouter);

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

app.use(express.json({ limit: '10kb' }));
app.use('/api/admin/upload', express.raw({ type: 'multipart/form-data', limit: '20mb' }));

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    adminKeySet: !!process.env.ADMIN_KEY,
  });
});

app.get('/', (req, res) => {
  res.status(200).json({ ok: true, service: 'dahlia-baasher-api', health: '/api/health' });
});

app.use('/api/admin', adminRouter);
app.use('/api/paintings', paintingsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/collections', collectionsRouter);
app.use('/api/commissions', commissionsRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/admin/upload', uploadRouter);
app.use('/api/site-settings', siteSettingsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path, method: req.method });
});

app.use(errorHandler);

const server = app.listen(PORT, () => {
  logInfo(`🎨 Dahlia Baasher API running on port ${PORT}`);
  logInfo(`Admin key configured: ${!!process.env.ADMIN_KEY}`);
});

process.on('SIGTERM', () => {
  logInfo('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    logInfo('Server closed');
    process.exit(0);
  });
});

export default app;
