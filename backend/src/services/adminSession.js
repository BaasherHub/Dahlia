import crypto from 'crypto';

export const ADMIN_SESSION_COOKIE = 'dahlia_admin_session';
const SESSION_MS = 12 * 60 * 60 * 1000; // 12 hours

function getSecret() {
  const secret = (process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_KEY || '').trim();
  if (!secret) return null;
  return secret;
}

function safeEqual(a, b) {
  try {
    const ba = Buffer.from(a);
    const bb = Buffer.from(b);
    if (ba.length !== bb.length) return false;
    return crypto.timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

export function createSessionToken() {
  const secret = getSecret();
  if (!secret) throw new Error('Admin session secret not configured');

  const exp = Date.now() + SESSION_MS;
  const payload = Buffer.from(JSON.stringify({ exp, v: 1 })).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifySessionToken(token) {
  const secret = getSecret();
  if (!secret || !token) return false;

  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;

  const expected = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  if (!safeEqual(sig, expected)) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return typeof data.exp === 'number' && data.exp > Date.now();
  } catch {
    return false;
  }
}

export function parseCookies(cookieHeader) {
  if (!cookieHeader || typeof cookieHeader !== 'string') return {};
  return Object.fromEntries(
    cookieHeader.split(';').map((part) => {
      const idx = part.indexOf('=');
      if (idx === -1) return [part.trim(), ''];
      return [part.slice(0, idx).trim(), decodeURIComponent(part.slice(idx + 1).trim())];
    })
  );
}

export function getSessionTokenFromRequest(req) {
  const cookies = parseCookies(req.headers.cookie);
  return cookies[ADMIN_SESSION_COOKIE] || '';
}

export function verifyAdminKey(key) {
  const expected = (process.env.ADMIN_KEY || '').trim();
  if (!expected || !key) return false;
  return safeEqual(key.trim(), expected);
}

export function setSessionCookie(res) {
  const token = createSessionToken();
  const secure = process.env.NODE_ENV === 'production';
  const parts = [
    `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${Math.floor(SESSION_MS / 1000)}`,
  ];
  if (secure) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

export function clearSessionCookie(res) {
  const secure = process.env.NODE_ENV === 'production';
  const parts = [
    `${ADMIN_SESSION_COOKIE}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0',
  ];
  if (secure) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

export function isRequestAdmin(req) {
  if (verifySessionToken(getSessionTokenFromRequest(req))) return true;
  const headerKey = (req.headers['x-admin-key'] || '').trim();
  return verifyAdminKey(headerKey);
}
