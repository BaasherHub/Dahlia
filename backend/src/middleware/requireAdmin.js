import { logInfo } from '../services/logger.js';
import { isRequestAdmin } from '../services/adminSession.js';

export function requireAdmin(req, res, next) {
  if (!isRequestAdmin(req)) {
    logInfo('Admin auth failed', { path: req.path, method: req.method });
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.isAdmin = true;
  next();
}
