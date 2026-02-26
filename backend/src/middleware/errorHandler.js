// src/middleware/errorHandler.js
export function errorHandler(err, req, res, next) {
  console.error(err);

  // Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({ error: 'Invalid input', details: err.errors });
  }

  // Stripe errors
  if (err.type?.startsWith('Stripe')) {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: 'Something went wrong. Please try again.' });
}
