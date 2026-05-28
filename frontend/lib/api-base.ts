/**
 * Browser: use same-origin `/api` (proxied by Next.js) so admin httpOnly cookies work.
 * Server: call the backend URL directly.
 */
export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return '';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
}
