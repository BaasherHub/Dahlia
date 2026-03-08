import { logError } from '../services/logger.js';

export function errorHandler(err, req, res, next) {
  const requestId = req.id || 'unknown';

  logError({
    message: err.message,
    stack: err.stack,
    requestId,
    method: req.method,
    path: req.path,
  });

  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
      requestId,
    });
  }

  if (err.type?.startsWith('Stripe')) {
    return res.status(400).json({
      error: 'Payment error',
      message: err.message,
      requestId,
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Resource not found',
      requestId,
    });
  }

  // Catch-all error handler
  res.status(err.status || 500).json({
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { message: err.message }),
    requestId,
  });
}
