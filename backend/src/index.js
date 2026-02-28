// src/index.js
import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';

import paintingsRouter from './routes/paintings.js';
import ordersRouter from './routes/orders.js';
import webhookRouter from './routes/webhook.js';
import adminRouter from './routes/admin.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Stripe webhook needs raw body BEFORE json parser
app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRouter);

// Standard middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://dahliabaasher.com',
  'https://www.dahliabaasher.com',
].filter(Boolean);
app.use(cors({ origin: (origin, cb) => cb(null, !origin || allowedOrigins.includes(origin)) }));
app.use(express.json());

// Routes
app.use('/api/paintings', paintingsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api', adminRouter);

app.get('/api/health', (_, res) => res.json({ ok: true }));

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🎨 Dahlia Baasher API running on port ${PORT}`);
});
